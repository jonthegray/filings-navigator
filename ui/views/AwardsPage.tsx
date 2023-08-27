import * as React from "react";
import Award, { JsonAward } from "../types/Award";
import AwardsList from "./AwardsList";

const AwardsPage = () => {
  const [awards, setAwards] = React.useState<Array<Award>>([]);
  const [page, setPage] = React.useState(1);
  const [minAmount, setMinAmount] = React.useState<number | null>(null);
  const [maxAmount, setMaxAmount] = React.useState<number | null>(null);

  const filingPeriodsById = React.useRef<Record<number, string>>({});
  const recipientNamesById = React.useRef<Record<number, string>>({});
  const isMounted = React.useRef(false);

  const loadPage = React.useCallback(async (page: number, minAmount: number | null, maxAmount: number | null) => {
    let uri = `/api/awards?page=${page}`;
    if (minAmount !== null) {
      uri += `&min_amount=${minAmount}`;
    }
    if (maxAmount !== null) {
      uri += `&max_amount=${maxAmount}`;
    }

    const response = await fetch(uri);
    const jsonAwards = await response.json() as Array<JsonAward>;
    setAwards(jsonAwards.map(j => Award.create(j, filingPeriodsById.current, recipientNamesById.current)));
  }, []);

  // Load filings and recipients on mount
  React.useEffect(() => {
    (async () => {
      let response = await fetch("/api/filings");
      const filings = await response.json() as Array<{ id: number; tax_period_end: string }>;
      filings.forEach(f => filingPeriodsById.current[f.id] = f.tax_period_end);

      response = await fetch("/api/recipients");
      const recipients = await response.json() as Array<{ id: number; name: string }>;
      recipients.forEach(r => recipientNamesById.current[r.id] = r.name);

      await loadPage(page, minAmount, maxAmount);
      isMounted.current = true;
    })();
  }, []);

  // Load new list of awards when page changes
  React.useEffect(() => {
    (async () => {
      if (isMounted.current) {
        await loadPage(page, minAmount, maxAmount);
      }
    })();
  }, [page])

  const minChanged: React.ChangeEventHandler<HTMLInputElement> = React.useCallback(event => {
    const value = Number(event.target.value);
    setMinAmount(Number.isNaN(value) || value === 0 ? null : value);
  }, []);

  const maxChanged: React.ChangeEventHandler<HTMLInputElement> = React.useCallback(event => {
    const value = Number(event.target.value);
    setMaxAmount(Number.isNaN(value) || value === 0 ? null : value);
  }, []);

  const applyFilter = () => {
    (async () => {
      setPage(1);

      if (page === 1) {
        await loadPage(page, minAmount, maxAmount);
      }
    })();
  };

  const goPrevious = () => {
    // Don't go below page 1
    setPage(page => page > 1 ? page - 1 : page);
  };

  const goNext = () => {
    // Don't keep loading if the current page is already empty
    setPage(page => awards.length === 0 ? page : page + 1);
  };

  return <div className="awards-page">
    <div className="header">
      <div className="filter">
        <div>Filter results: Amount from</div>
        <input type="number" value={minAmount ?? ""} onChange={minChanged} />
        <div>to</div>
        <input type="number" value={maxAmount ?? ""} onChange={maxChanged} />
        <button type="button" onClick={applyFilter}>Apply Filter</button>
      </div>
      <div className="paging">
        <button type="button" onClick={goPrevious}>Previous</button>
        <button type="button" onClick={goNext}>Next</button>
      </div>
    </div>
    <AwardsList awards={awards} />
  </div>;
};

export default AwardsPage;
