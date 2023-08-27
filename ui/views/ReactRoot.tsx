import * as React from "react";
import ReactPage from "../types/ReactPage";

interface Props {
  page: ReactPage;
}

const ReactRoot = ({ page }: Props) => {
  return <div>Hello from React</div>;
};

export default ReactRoot;
