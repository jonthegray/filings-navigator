require "nokogiri"
require "open-uri"

base_path = "https://filing-service.s3-us-west-2.amazonaws.com/990-xmls/"

file_names = [
  "201612429349300846_public.xml",
  "201831309349303578_public.xml",
  "201641949349301259_public.xml",
  "201921719349301032_public.xml",
  "202141799349300234_public.xml",
  "201823309349300127_public.xml",
  "202122439349100302_public.xml",
  "201831359349101003_public.xml"
]

def get_is_amended(doc) = !doc.at_css("amendedreturnind").nil?
def get_period_end(doc) = doc.at_css("taxperiodenddt, taxperiodenddate").text
def get_return_ts(doc) = doc.at_css("returnts").text

def get_address(root_node)
  address_root = root_node.at_xpath("./usaddress | ./addressus")
  address = address_root.at_xpath("./addressline1 | ./addressline1txt").text
  city = address_root.at_xpath("./city | ./citynm").text
  state = address_root.at_xpath("./state | ./stateabbreviationcd").text
  zip = address_root.at_xpath("./zipcode | ./zipcd").text

  return {address: address, city: city, state: state, zip_code: zip}
end

filings_by_period_by_ein = {}

# Get the right filing for each EIN and period
file_names.each do |file_name|
  doc = Nokogiri::HTML(URI.open(base_path + file_name))

  filer_ein = doc.at_css("filer > ein").text
  period_end = doc.at_css("taxperiodenddt, taxperiodenddate").text
  is_amended = get_is_amended(doc)

  # Check for newer filing already in hash
  if filings_by_period_by_ein[filer_ein]&.include?(period_end)
    existing = filings_by_period_by_ein[filer_ein][period_end]
    existing_is_amended = get_is_amended(existing)
    existing_return_ts = get_return_ts(existing)

    next if existing_is_amended && !is_amended
    next if !is_amended && existing_return_ts > return_ts
    next if existing_is_amended && is_amended && existing_return_ts > return_ts
  end

  filings_by_period_by_ein[filer_ein] ||= {}
  filings_by_period_by_ein[filer_ein][period_end] = doc
end

filer_id_by_ein = {}
recipient_id_by_ein = {}

# Parse filings to seed DB
filings_by_period_by_ein.each do |filer_ein, filings_by_period|
  filings_by_period.sort_by(&:first).each do |period_end, doc|
    # Create/update filer
    name_root = doc.at_css("filer > name, filer > businessname")
    filer_name = name_root.at_xpath("./businessnameline1 | ./businessnameline1txt").text
    address = get_address(doc.at_css("filer"))
    filer_attrs = address.merge({ein: filer_ein, name: filer_name})

    if filer_id_by_ein.include?(filer_ein)
      filer = Filer.update(filer_id_by_ein[filer_ein], **filer_attrs)
    else
      filer = Filer.create(**filer_attrs)
      filer_id_by_ein[filer_ein] = filer.id
    end

    # Create filing
    return_ts = doc.at_css("returnts").text
    filing = Filing.create(filing_time: return_ts, tax_period_end: period_end, filer_id: filer.id)

    doc.css("irs990schedulei recipienttable").each do |recipient_table|
      # Create/update recipient
      recipient_ein = recipient_table.at_xpath("./recipientein | ./einofrecipient")&.text

      # Only track awards for identifiable recipients
      if recipient_ein.nil?
        next
      end

      name_root = recipient_table.at_css("recipientnamebusiness, recipientbusinessname")
      recipient_name = name_root.at_xpath("./businessnameline1 | ./businessnameline1txt").text
      address = get_address(recipient_table)
      recipient_attrs = address.merge({ein: recipient_ein, name: recipient_name})

      if recipient_id_by_ein.include?(recipient_ein)
        recipient = Recipient.update(recipient_id_by_ein[recipient_ein], **recipient_attrs)
      else
        recipient = Recipient.create(**recipient_attrs)
        recipient_id_by_ein[recipient_ein] = recipient.id
      end

      # Create award
      amount = recipient_table.at_css("amountofcashgrant, cashgrantamt").text
      purpose = recipient_table.at_css("purposeofgranttxt").text

      Award.create(amount: amount, purpose: purpose, filing_id: filing.id, recipient_id: recipient.id)
    end
  end
end
