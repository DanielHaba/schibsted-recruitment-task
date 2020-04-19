
export interface IDatabase {
    connect(uri: string): Promise<void>;
}