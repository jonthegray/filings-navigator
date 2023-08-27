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
  private _page?: ReactPage;

  constructor() {
    super();

    this._container = document.createElement("div");
    this._container.id = "react-root";
    this._container.classList.add("react-styles");
    this._root = createRoot(this._container);

    this.rerender = this.rerender.bind(this);
  }

  set page(val: ReactPage) {
    this._page = val;
    this.rerender();
  }

  connectedCallback() {
    this.appendChild(this._container);
    this.rerender();
  }

  private rerender() {
    if (!this.isConnected || this._page === undefined) {
      return;
    }

    const element = createElement(ReactRoot, {
      page: this._page
    });

    this._root.render(element);
  }
}

window.customElements.define("react-root", ReactRootElement);
