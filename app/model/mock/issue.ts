import { IIssueRepository, IIssue, IIssuePersistor, IssueState } from "../issue";

export class IssueMockedSource implements IIssueRepository, IIssuePersistor {
    public constructor (
        private records: IIssue[],
    ) {}

    public setRecords(records: IIssue[]) {
        this.records = records;
    }

    public getRecords(): IIssue[] {
        return this.records;
    }

    public save(issue: Partial<IIssue>): Promise<void> {
        let index = this.findById(issue._id);
        if (index < 0) {
            index = this.records.length;
            this.records[index] = {
                _id: index + 1,
                title: "",
                description: "",
                state: IssueState.Open,
            };
        }
        Object.assign(this.records[index], issue);
        return Promise.resolve();
    }

    public getById(id: any): Promise<IIssue> {
        const index = this.findById(id);
        if (index >= 0) {
            return Promise.resolve(this.records[index]);
        }
        return Promise.reject(
            new Error(`Issue with id ${id} not found`)
        );
    }

    public getAll(): Promise<IIssue[]> {
        return Promise.resolve(this.records);
    }

    private findById(id: any): number {
        // i used double equal sign because i want type correction
        // eslint-disable-next-line eqeqeq
        return this.records.findIndex((issue) => issue._id == id);
    }
}
