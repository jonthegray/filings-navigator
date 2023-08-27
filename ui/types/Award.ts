
/*
 * Award data from the server
 */
interface JsonAward {
  id: number;
  amount: number;
  purpose: string;
  filing_id: number;
  recipient_id: number;
}

/*
 * Award model to use on the client
 */
class Award {
  id: number;
  amount: number;
  purpose: string;
  taxPeriodEnd: string;
  recipientName: string;

  private constructor(id: number, amount: number, purpose: string, taxPeriodEnd: string, recipientName: string) {
    this.id = id;
    this.amount = amount;
    this.purpose = purpose;
    this.taxPeriodEnd = taxPeriodEnd;
    this.recipientName = recipientName;
  }

  static create(
    json: JsonAward,
    filingPeriodsById: Record<number, string>,
    recipientNamesById: Record<number, string>
  ) {
    const taxPeriodEnd = filingPeriodsById[json.filing_id];
    const recipientName = recipientNamesById[json.recipient_id];

    return new Award(json.id, json.amount, json.purpose, taxPeriodEnd, recipientName);
  }
}

export default Award;
export { JsonAward };
