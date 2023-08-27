import * as React from "react";
import Award, { JsonAward } from "../types/Award";
import AwardsList from "./AwardsList";

const PAGE_SIZE = 50;

const AwardsPage = () => {
  const [filingPeriodsById, setFilingPeriodsById] = React.useState<Record<number, string>>({});
  const [recipientNamesById, setRecipientNamesById] = React.useState<Record<number, string>>({});
  const [awards, setAwards] = React.useState<Array<Award | undefined>>(Array.from({ length: PAGE_SIZE }));
  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    (async () => {
      // Load filings
      let response = await fetch("http://localhost:3000/api/filings");
      const filings = await response.json() as Array<{ id: number; tax_period_end: string }>;

      const filingMap: Record<string, string> = {};
      filings.forEach(f => filingMap[f.id] = f.tax_period_end);
      setFilingPeriodsById(filingMap);

      // Load recipients
      response = await fetch("http://localhost:3000/api/recipients");
      const recipients = await response.json() as Array<{ id: number; name: string }>;

      const recipientMap: Record<string, string> = {};
      recipients.forEach(r => recipientMap[r.id] = r.name);
      setRecipientNamesById(recipientMap);

      // Load starting page of awards
      response = await fetch(`http://localhost:3000/api/awards?page=${page}`);
      const jsonAwards = await response.json() as Array<JsonAward>;
      setAwards(jsonAwards.map(j => Award.create(j, filingMap, recipientMap)));
    })();
  }, []);

  return <div className="awards-page">
    <AwardsList awards={awards} />
  </div>;
};

export default AwardsPage;
