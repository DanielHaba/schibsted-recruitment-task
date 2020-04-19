import React from "react";
import ReactDom from "react-dom";
import { Application } from "./app";

(() => {
    "use strict";
    ReactDom.render(
        React.createElement(Application),
        document.getElementById("app-root")
    );
})();
