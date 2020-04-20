import "mocha";
import { expect } from "chai";
import { Application } from "../../app/app";
import { IssueMockedSource } from "../../app/model/mock/issue";
import { IssueState, IIssue } from "../../app/model/issue";
import supertest from "supertest";
import express from "express";

describe("src/controller/issue", () => {

    const IssueSamples: IIssue[] = [
        {
            _id: 1,
            title: "Test",
            description: "Content",
            state: IssueState.Open,
        }, {
            _id: 2,
            title: "Issue",
            description: "Fix it!",
            state: IssueState.Closed,
        },
    ];

    let issueSource: IssueMockedSource;
    let app: express.Application;

    before(() => {
        app = express();
        issueSource = new IssueMockedSource([]);
        const services = {
            issuePersistor: issueSource,
            issueRepository: issueSource,
        };
        new Application(services, {
            port: 1234,
            dbHost: "localhost",
            dbName: "test",
            dbUser: "test",
            dbPassword: "test",
            dbPort: 1234,
            staticPath: "/tmp/",
        }, app);
    });

    beforeEach(() => {
        issueSource.setRecords(IssueSamples);
    });

    context("GET /api/issue", () => {
        it("should return issues", (done) => {
            supertest(app)
                .get("/api/issue")
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    expect(res.body).to.be.deep.equal(IssueSamples);
                    done();
                });
        });
    });

    context("GET /api/issue/:id", () => {
        it("should return specified issue", (done) => {
            const issue = IssueSamples[1];
            supertest(app)
                .get(`/api/issue/${issue._id}`)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    expect(res.body).to.be.deep.equal(issue);
                    done();
                });
        });

        it("should return 404 when issue not exists", (done) => {
            supertest(app)
                .get("/api/issue/321")
                .expect(404, done);
        });
    });

    context("POST /api/issue", () => {
        it("should create new issue", (done) => {
            const issueData = {
                title: "Test",
                description: "Simple",
            };
            issueSource.setRecords([]);
            supertest(app)
                .post("/api/issue")
                .send(issueData)
                .expect(200)
                .end((err) => {
                    if (err) {
                        return done(err);
                    }
                    expect(issueSource.getRecords()[0]).to.be.deep.equal({
                        ...issueData,
                        state: IssueState.Open,
                        _id: 1,
                    });
                    done();
                });
        });
    });
    

    context("PUT /api/issue/:id", () => {
        it("should update specified issue", (done) => {
            const issueData = {
                title: "Heya",
                description: "Simple",
                state: IssueState.Pending,
            };
            supertest(app)
                .put("/api/issue/1")
                .send(issueData)
                .expect(200)
                .end((err) => {
                    if (err) {
                        return done(err);
                    }
                    expect(issueSource.getRecords()[0]).to.be.deep.equal({
                        ...issueData,
                        _id: 1,
                    });
                    done();
                });
        });
    });
});