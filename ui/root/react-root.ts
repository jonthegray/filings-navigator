import { createElement } from "react";
import { createRoot, Root } from "react-dom/client";
import ReactPage from "../types/ReactPage";
import ReactRoot from "../views/ReactRoot";

/*
 * Web component that serves as the root for the React application
 */
class ReactRootElement extends HTMLElement {
  private readonly _container: HTMLElement;
  private readonly _root: Root;

  constructor() {
    super();

    this._container = document.createElement("div");
    this._root = createRoot(this._container);

    this.rerender = this.rerender.bind(this);
  }

  connectedCallback() {
    this.appendChild(this._container);
    this.rerender();
  }

  private rerender() {
    if (!this.isConnected) {
      return;
    }

    const page = this.getAttribute("page");
    if (page === null) {
      return;
    }

    const element = createElement(ReactRoot, { page: (page as ReactPage) });

    this._root.render(element);
  }
}

window.customElements.define("react-root", ReactRootElement);
