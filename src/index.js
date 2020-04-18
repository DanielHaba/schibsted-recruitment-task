
require("ts-node").register();

const express = require("express");
const routes = require("./routes");
const config = new Map(Object.entries(require("./config.json")));

(() => {
    "use strict";
    const app = express();
    const port = config.get("port") || process.env["APP_PORT"] || 8080;

    app.use(routes.Router);
    app.listen(port);
})();
