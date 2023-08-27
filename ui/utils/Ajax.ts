import { JsonAward } from "../types/Award";

const loadAwardsPage = async (
  page: number,
  minAmount: number | null,
  maxAmount: number | null
) => {
  let uri = `/api/awards?page=${page}`;
  if (minAmount !== null) {
    uri += `&min_amount=${minAmount}`;
  }
  if (maxAmount !== null) {
    uri += `&max_amount=${maxAmount}`;
  }

  const response = await fetch(uri);
  const jsonAwards = await response.json() as Array<JsonAward>;
  return jsonAwards;
};

const loadFilingsAndRecipients = async () => {
  let response = await fetch("/api/filings");
  const filings = await response.json() as Array<{ id: number; tax_period_end: string }>;

  response = await fetch("/api/recipients");
  const recipients = await response.json() as Array<{ id: number; name: string }>;

  return { filings, recipients };
};

export {
  loadAwardsPage,
  loadFilingsAndRecipients
};
