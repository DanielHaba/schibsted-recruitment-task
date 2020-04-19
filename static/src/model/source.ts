
export class RestSource<T extends {}> {
      
    public constructor(
        private path: string,
        private reporter: (msg: string) => void = alert.bind(window),
        private fetcher: typeof fetch = fetch.bind(window),
    ) {}

    public async getById(id: any): Promise<T> {
        return this.request("GET", `${this.path}/${id}`);
    }

    public async getAll(): Promise<T[]> {
        return this.request("GET", this.path);
    }

    public save(obj: T): Promise<void> {
        const id = this.getId(obj);
        return typeof(id) !== "undefined"
            ? this.update(id, obj)
            : this.create(obj);
    }

    private create(obj: T): Promise<void> {
        return this.request("POST", this.path, obj);
    }

    private update(id: any, obj: T): Promise<void> {
        return this.request("PUT", `${this.path}/${id}`, obj);
    }

    private getId(obj: T): any {
        const possibleFields = ["_id", "id"];
        for (const field of possibleFields) {
            if (Reflect.has(obj, field)) {
                return Reflect.get(obj, field);
            }
        }
    }

    private async request<T>(method: string, url: string, body?: string|object): Promise<T> {
        if (typeof(body) === "object") {
            body = JSON.stringify(body);
        }
        const response = await this.fetcher(url, {
            method,
            body,
            redirect: "follow",
            headers: {
                "Content-Type": "application/json",
                "Accepts": "application/json",
            },
        });
        let content: any = await response.text();
        try {
            content = JSON.parse(content);
        } catch (err) {
            // consume error
        }

        if (response.status >= 200 && response.status < 400) {
            return content;
        } else {
            const msg = this.renderErrorMessage(content);
            this.reporter(msg);
            throw new Error(msg);
        }
    }

    private renderErrorMessage(err: any): string {
        if (typeof(err) === "object") {
            if (err.message) {
                return "" + err.message;
            }
            if (err.toString) {
                return err.toString();
            }
        }
        return "" + err;
    }
} 
