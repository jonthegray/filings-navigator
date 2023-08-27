import * as React from "react";
import Award from "../types/Award";

interface Props {
  awards: Array<Award | undefined>;
}

const ITEM_HEIGHT = 60; // total height of award item in px

interface ItemProps {
  award: Award | undefined;
}

const Item = ({ award }: ItemProps) => {
  let content = null;
  if (award !== undefined) {
    content = (
      <React.Fragment>
        <div className="name">{award.recipientName}</div>
        <div className="second-row">
          <div className="amount">{award.amount}</div>
          <div className="purpose">{award.purpose}</div>
          <div className="date">{award.taxPeriodEnd}</div>
        </div>
      </React.Fragment>
    )
  } else {
    content = <div className="loading">Loading Award...</div>;
  }

  return <div className="award">{content}</div>;
};

const AwardsList = ({ awards }: Props) => {
  const items = awards.map((a, i) => <Item key={a?.id ?? i} award={a} />);

  return (
    <div className="awards-list">
      {items}
    </div>
  );
};

export default AwardsList;
