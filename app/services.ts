import { IIssuePersistor, IIssueRepository } from "./model/issue";
import * as winston from "winston";

export interface IServices {
    logger?: winston.Logger;
    issueRepository: IIssueRepository;
    issuePersistor: IIssuePersistor;
}
