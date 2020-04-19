import { IIssueRepository, IIssue } from "../issue";

export class IssueMockedRepository implements IIssueRepository {
    public constructor (
        private records: IIssue[]
    ) {}

    public getById(id: any): Promise<IIssue> {
        for (const issue of this.records) {
            // i used double euql sign because i want type correction
            // eslint-disable-next-line eqeqeq
            if (issue._id == id) {
                return Promise.resolve(issue);
            }
        }
        return Promise.reject(
            new Error(`Issue with id ${id} not found`)
        );
    }

    public getAll(): Promise<IIssue[]> {
        return Promise.resolve(this.records);
    }
}
