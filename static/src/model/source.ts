
export class RestSource<T extends {}> {
      
    public constructor(
        private path: string,
        private fetcher: typeof fetch = fetch.bind(window),
    ) {}

    public async getById(id: any): Promise<T> {
        const response = await this.fetcher(`${this.path}/${id}`, {
            method: "GET",
            redirect: "follow",
            headers: {
                "Content-Type": "application/json",
                "Accepts": "application/json",
            },
        });

        return response.json();
    }

    public async getAll(): Promise<T[]> {
        const response = await this.fetcher(`${this.path}`, {
            method: "GET",
            redirect: "follow",
            headers: {
                "Content-Type": "application/json",
                "Accepts": "application/json",
            },
        });

        return response.json();
    }

    public async save(obj: T): Promise<void> {
        const id = this.getId(obj);
        return typeof(id) !== "undefined"
            ? this.update(id, obj)
            : this.create(obj);
    }

    private async create(obj: T): Promise<void> {
        await this.fetcher(`${this.path}`, {
            method: "POST",
            redirect: "follow",
            headers: {
                "Content-Type": "application/json",
                "Accepts": "application/json",
            },
            body: JSON.stringify(obj),
        });
    }

    private async update(id: any, obj: T): Promise<void> {
        await this.fetcher(`${this.path}/${id}`, {
            method: "PUT",
            redirect: "follow",
            headers: {
                "Content-Type": "application/json",
                "Accepts": "application/json",
            },
            body: JSON.stringify(obj),
        });
    }

    private getId(obj: T): any {
        const possibleFields = ["_id", "id"];
        for (const field of possibleFields) {
            if (Reflect.has(obj, field)) {
                return Reflect.get(obj, field);
            }
        }
    }
}
