import * as React from "react";
import Award from "../types/Award";
import AwardsListItem from "./AwardsListItem";

interface Props {
  awards: Array<Award>;
}

const AwardsList = (props: Props) => {
  const items = props.awards.map(a => <AwardsListItem key={a.id} award={a} />);

  return (
    <div className="awards-list">
      {items}
    </div>
  );
};

export default AwardsList;
