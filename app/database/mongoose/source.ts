import mongoose = require("mongoose");


export class MongooseDatabaseSource<T extends {}> {
    
    public constructor(
        private model: mongoose.Model<T & mongoose.Document>,
    ) {}

    public getById(id: any): Promise<T> {
        return this.model
            .findById(id)
            .exec()
            .then((obj) => {
                return obj
                    ? Promise.resolve(obj)
                    : Promise.reject(new Error("Not found"));
            });
    }

    public getAll(): Promise<T[]> {
        return this.model
            .find()
            .exec();
    }

    public save(obj: T): Promise<void> {
        return obj instanceof mongoose.Document
            ? this.update(obj)
            : this.create(obj);
    }

    private async create(obj: T): Promise<void> {
        await this.model.create(obj);
    }

    private async update(obj: T & mongoose.Document): Promise<void> {
        await obj.save();
    }
}