import * as React from "react";
import Award from "../types/Award";

interface Props {
  awards: Array<Award>;
}

const dollarFormatter = Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

interface ItemProps {
  award: Award;
}

const Item = ({ award }: ItemProps) => {
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

const AwardsList = (props: Props) => {
  const items = props.awards.map(a => <Item key={a.id} award={a} />);
  return <div className="awards-list">{items}</div>;
};

export default AwardsList;
