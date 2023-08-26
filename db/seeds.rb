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

filings_by_period_by_ein = {}

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

filings_by_period_by_ein.each do |filer_ein, filings_by_period|
  latest_period = filings_by_period.keys.last
  latest_filing = filings_by_period[latest_period]

  name_root = latest_filing.at_css("filer > name, filer > businessname")
  filer_name = name_root.at_xpath("./businessnameline1 | ./businessnameline1txt").text

  address_root = latest_filing.at_css("filer > usaddress, filer > addressus")
  filer_address = address_root.at_xpath("./addressline1 | ./addressline1txt").text
  filer_city = address_root.at_xpath("./city | ./citynm").text
  filer_state = address_root.at_xpath("./state | ./stateabbreviationcd").text
  filer_zip = address_root.at_xpath("./zipcode | ./zipcd").text

  Filer.create(
    :ein => filer_ein,
    :name => filer_name,
    :address => filer_address,
    :city => filer_city,
    :state => filer_state,
    :zip_code => filer_zip
  )
end
