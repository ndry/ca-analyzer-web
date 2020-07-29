export class CacheMap extends Map {
    constructor(create) {
        super();
        this.create = create;
    }
    get(key) {
        const value = super.get(key) ?? this.create(key);
        super.set(key, value);
        return value;
    }
}
//# sourceMappingURL=CacheMap.js.map