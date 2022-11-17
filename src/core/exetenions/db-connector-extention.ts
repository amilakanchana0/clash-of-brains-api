export class DbConnectorExtention {
    create<T>(type: (new () => T)): T {
        return new type();
    }
}