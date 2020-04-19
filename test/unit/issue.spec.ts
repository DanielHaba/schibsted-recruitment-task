import "mocha";
import { expect } from "chai";
import { IssueState, getIssueAllowedStates, isIssueStateAllowed } from "../../app/model/issue";

describe("src/model/issue", () => {

    context("getIssueAllowedStates", () => {

        it("should return all states when open", () => {
            const states = getIssueAllowedStates(IssueState.Open);
            expect(states).to.contain(IssueState.Open)
                .and.to.contain(IssueState.Pending)
                .and.to.contain(IssueState.Closed)
                .and.length(3);
        });

        it("should return pending and closed states when pending", () => {
            const states = getIssueAllowedStates(IssueState.Pending);
            expect(states).to.contain(IssueState.Pending)
                .and.to.contain(IssueState.Closed)
                .and.length(2);
        });

        it("should return only closed state when closed", () => {
            const states = getIssueAllowedStates(IssueState.Closed);
            expect(states).to.contain(IssueState.Closed)
                .and.length(1);
        });

        it("should return empty array when state is invalid", () => {
            const states = getIssueAllowedStates("not-existing-state" as IssueState);
            expect(states).to.be.empty.and.to.be.an.instanceOf(Array);
        });
    });

    context("isIssueStateAllowed", () => {

        const truthTable: { [key: string]: {[key: string]: boolean}} = {
            [IssueState.Open]: {
                [IssueState.Open]: true,
                [IssueState.Pending]: true,
                [IssueState.Closed]: true,
            },
            [IssueState.Pending]: {
                [IssueState.Open]: false,
                [IssueState.Pending]: true,
                [IssueState.Closed]: true,
            },
            [IssueState.Closed]: {
                [IssueState.Open]: false,
                [IssueState.Pending]: false,
                [IssueState.Closed]: true,
            },
        }

        it("should return state transition permission", () => {
            for (const fromState in truthTable) {
                for (const toState in truthTable[fromState]) {
                    expect(isIssueStateAllowed(fromState as IssueState, toState as IssueState))
                        .to.be.equal(truthTable[fromState][toState], `transition from ${fromState} to ${toState}`);
                }
            }
        });

        it("should return false when new state is not defined", () => {
            for (const fromState in truthTable) {
                expect(isIssueStateAllowed(fromState as IssueState))
                    .to.be.equal(false, `transition from ${fromState} to undefined`);
            }
        });
    });
});