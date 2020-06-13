export class Pool<T> extends Array<T> {
    constructor(
        public create: () => T,
    ) {
        super();
    }

    pop() {
        return super.pop() ?? this.create();
    }
}
