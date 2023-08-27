import * as React from "react";
import Award from "../types/Award";

interface Props {
  award: Award;
}

const dollarFormatter = Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

const AwardsListItem = ({ award }: Props) => {
  const formattedAmount = dollarFormatter.format(award.amount);

  return (
    <div className="award">
      <div className="name">{award.recipientName}</div>
      <div className="second-row">
        <div className="amount">{formattedAmount}</div>
        <div className="purpose">{award.purpose}</div>
        <div className="date">{award.taxPeriodEnd}</div>
      </div>
    </div>
  );
};

export default AwardsListItem;
