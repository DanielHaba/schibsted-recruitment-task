import React from "react";
import { IIssueRepository, IIssuePersistor } from "../../app/model/issue";

export interface IAppContext {
    issueRepository: IIssueRepository;
    issuePersistor: IIssuePersistor;
}

export const AppContext = React.createContext<IAppContext>({} as IAppContext);

export function getAppContext(component: React.Component): IAppContext {
    return typeof(component.context) === "object" 
        ?  component.context
        : {};
}
