import * as express from "express" ;
import { IssueController } from "./controller/issue";
import * as winstonMiddleware from "express-winston";
import mongoose from "mongoose";
import { IServices } from "./services";
import bodyParser from "body-parser";
import * as path from "path";

export interface AppConfig {
    port: number;
    dbHost: string;
    dbName: string;
    dbUser: string;
    dbPort: number;
    dbPassword: string;
    staticPath: string;
}

interface IController {
    mount(): express.Router;
}

type ControllerFactory = new(services: IServices) => IController;

export class Application {

    public Controllers: ControllerFactory[] = [
        IssueController,
    ];

    // default values is not part of js standard. when rewriting to javascript we should handle default value in constructor code
    public constructor (
        private services: IServices,
        private config: AppConfig,
        private app: express.Application = express.default(),
    ) {}

    public run () {
        const onStart = () => {
            if (this.services.logger) {
                this.services.logger.info(`Application starts on port ${this.config.port}`);
            }
        };
        this.setup().then(() => {
            this.app.listen(this.config.port, onStart);
        })
    }

    private async setup () {
        this.app.use(bodyParser.urlencoded());
        this.app.use(bodyParser.json());
        
        this.setupLogger();
        await this.setupDatabase();
        this.setupRouting();
    }

    private async setupDatabase () {
        // seems to be overkill but in docker environment there is a chance that database container is not started yet.

        const cfg = this.config;
        const uri = `mongodb://${cfg.dbHost}:${cfg.dbPort}/${cfg.dbName}`;
        let attemptsLeft = 8;
        const after = (duration: number): Promise<void> => {
            return new Promise((resolve) => {
                setTimeout(resolve, duration);
            })
        }

        const tryConnect = (): Promise<typeof mongoose> => {
            if (this.services.logger) {
                this.services.logger.info(`Trying to connect to ${cfg.dbHost}:${cfg.dbPort}`);
            }
            return mongoose.connect(uri, {
                useNewUrlParser: true,
                user: cfg.dbUser,
                pass: cfg.dbPassword,
            }).catch(() => {
                if (attemptsLeft <= 0) {
                    return Promise.reject(new Error("Could not connect to database"));
                }
                attemptsLeft--;
                return after(1000).then(tryConnect);
            });
        }

        await tryConnect();
    }

    private setupLogger () {
        if (this.services.logger) {
            this.app.use(winstonMiddleware.logger({
                winstonInstance: this.services.logger,
            }));
        }
    }

    private setupRouting () {
        const staticPath = path.isAbsolute(this.config.staticPath)
            ? this.config.staticPath
            : path.join(process.cwd(), this.config.staticPath);

        this.app.use(express.static(staticPath));

        const controllers = this.Controllers.map(
            (factory) => new factory(this.services).mount()
        );

        this.app.use(
            "/api",
            ...controllers,
        );

        this.app.get("*", (req, res) => {
            if (req.accepts("html")) {
                res.sendFile(path.join(staticPath, "index.html"), (err) => {
                    if (err) {
                        res.status(500);
                        res.send("Something went wrong");
                        if (this.services.logger) {
                            this.services.logger.error(err.message);
                        }
                    }
                    res.end();
                });
            } else {
                res.status(404);
                res.send("Not found");
                res.end();
            }
        });
    }
}
