export class CacheMap<TKey, TValue> extends Map<TKey, TValue> {
    constructor(
        public create: (key: TKey) => TValue,
    ) {
        super();
    }

    get(key: TKey) {
        const value = super.get(key) ?? this.create(key);
        super.set(key, value);
        return value;
    }
}
