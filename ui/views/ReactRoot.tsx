import * as React from "react";
import ReactPage from "../types/ReactPage";
import AwardsPage from "./AwardsPage";
import HomePage from "./HomePage";

interface Props {
  page: ReactPage;
}

const ReactRoot = ({ page }: Props) => {
  let header;
  let content;
  switch (page) {
    case "home":
      header = "Filings Navigator Home";
      content = <HomePage />;
      break;
    case "awards":
      header = "Awards";
      content = <AwardsPage />;
      break;
  }

  return (
    <React.Fragment>
      <h1>{header}</h1>
      <div id="react-body">{content}</div>
    </React.Fragment>
  )
};

export default ReactRoot;
