#!/usr/bin/env node
(() => {
    "use strict";
    if (["1", "true", "yes"].includes(process.env.APP_TRANSPILE_RUNTIME)) {
        require("ts-node").register();
    }

    const { MongooseDatabaseSource } = require("./database/mongoose/source");
    const { Issue } = require("./database/mongoose/issue");
    const winston = require("winston");

    const issueSource = new MongooseDatabaseSource(Issue);

    const logger = winston.createLogger({
        level: "info",
        format: winston.format.json(),
        transports: [
            new winston.transports.File({ filename: "error.log", level: "error" }),
            new winston.transports.File({ filename: "combined.log" }),
        ],
    });
  
    if (process.env.NODE_ENV !== "production") {
        logger.add(new winston.transports.Console({
            format: winston.format.cli(),
        }));
    }

    const services = {
        logger,
        issueRepository: issueSource,
        issuePersistor: issueSource,
    };

    // one-liner, not verry pretty. we could wrote it as
    // const {Application} = require("./app");
    // const app = new Application(...);
    const app = new (require("./app").Application)(services, {
        // plus before expression enforce casting to number
        port: +process.env.APP_PORT || 8080,
        dbHost: process.env.APP_DATABASE_HOST || "localhost",
        dbPort: +process.env.APP_DATABASE_PORT || 27017,
        dbName: process.env.APP_DATABASE_NAME || "issue_tracker",
        dbUser: process.env.APP_DATABASE_USER,
        dbPassword: process.env.APP_DATABASE_PASSWORD,
    });

    app.run();
})()
