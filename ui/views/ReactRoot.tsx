import * as React from "react";
import ReactPage from "../types/ReactPage";
import Awards from "./Awards";
import Home from "./Home";

interface Props {
  page: ReactPage;
}

const ReactRoot = ({ page }: Props) => {
  switch (page) {
    case "home":
      return <Home />;
    case "awards":
      return <Awards />;
  }
};

export default ReactRoot;
