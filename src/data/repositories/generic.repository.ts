
import { DB } from "../../core/db/db-connection";

export class GenricRepository<T>{
    db: DB;
    constructor(db: DB) {
        this.db = db;
    }

    map(rows: any[]): T[] {
        let entities = rows.map((row: any) => {
            let keys: string[] = Object.keys(row);
            let entity: any = {};
            keys.forEach((key: string) => {
                entity[key] = row[key];
            });
            return entity as T;
        });
        return entities;
    }
}