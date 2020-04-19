import { IIssueRepository, IssueState, IIssuePersistor, IIssue, isIssueStateAllowed } from "../model/issue";
import * as express from "express";
import { IServices } from "../services";
import winston from "winston";

export class IssueController {

    private repository: IIssueRepository;
    private persistor: IIssuePersistor;
    private logger: winston.Logger;

    // in pure js we don't have visibility modifier so they should be removed from javascript code.
    // using visibility modifier before the constructor parameter creates the property with parameter name and specified visibility. it also automatically assigns parameter to a property
    // i'm using it because it makes constructor body cleaner (now is empty which is perfect) and easier to maintain. 
    public constructor(
        services: IServices,
    ) {
        this.repository = services.issueRepository;
        this.persistor = services.issuePersistor;
        this.logger = services.logger;
    }

    public mount(): express.IRouter {
        const router = express.Router();
        router.get("/issue", this.index.bind(this));
        router.get("/issue/:id", this.view.bind(this));
        router.post("/issue", this.create.bind(this));
        router.put("/issue/:id", this.update.bind(this));
        return router;
    }
    
    // async wraps result of the method into a promise so i have to specify the return type as promise
    // async also allow to use await keyword but we could write this function as promise chain
    // this is like some kind of syntax sugar which sightly improves code readability
    public async index(_: express.Request, res: express.Response): Promise<void> {
        const issues = await this.repository.getAll();
        res.json(issues);
        res.end();
    }

    public async view(req: express.Request, res: express.Response): Promise<void> {
        try {
            const issue = await this.repository.getById(req.params["id"]);
            res.json(issue);
            res.end();
        } catch (err) {
            if (this.logger) {
                this.logger.error(err);
            }
            res.status(404);
            res.json({ message: "Not found" });
            res.end();
        }
    }

    public async create(req: express.Request, res: express.Response): Promise<void> {
        try {
            const issue = this.extractData(req);
            issue.state = IssueState.Open;
            const err  = this.validate(issue, IssueState.Open);
            if (err) {
                res.status(400);
                res.json({ message: err.message });
            } else {
                await this.persistor.save(issue);
            }
            res.end();
        } catch (err) {
            if (this.logger) {
                this.logger.error(err);
            }
            res.status(500);
            res.json({ message: "Something went wrong" });
            res.end();
        }
    }

    private async update(req: express.Request, res: express.Response): Promise<void> {
        try {
            const issue = await this.repository.getById(req.params.id);
            const prevState = issue.state;
            Object.assign(issue, this.extractData(req));
            const err = this.validate(issue, prevState);
            if (err) {
                res.status(400);
                res.json({ message: err.message });
            } else {
                await this.persistor.save(issue);
            }
            res.end();
        } catch (err) {
            if (this.logger) {
                this.logger.error(err);
            }
            res.status(500);
            res.json({ message: "Something went wrong" });
            res.end();
        }
    }

    private extractData(req: express.Request): Partial<IIssue> {
        const data: Partial<IIssue> = {};
        if (req.body.title) {
            // quick string casting
            data.title = "" + req.body.title;
        }
        if (req.body.description) {
            data.description = "" + req.body.description;
        }
        if (req.body.state) {
            data.state = req.body.state;
        }

        return data;
    }

    private validate(issue: Partial<IIssue>, prevState: IssueState): Error|null {
        if (!issue.title || issue.title.length < 4 || issue.title.length > 64) {
            return new Error("title cannot be empty and have to be between 4 and 64 characters");
        }
        if (!issue.description || issue.description.length > 2048) {
            return new Error("description cannot be empty and have to be shorter than 2048 characters");
        }
        if (!isIssueStateAllowed(prevState, issue.state)) {
            return new Error("unallowed issue state");
        }
        return null;
    }
}
