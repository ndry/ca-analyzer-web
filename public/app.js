System.register("hello", [], function (exports_1, context_1) {
    "use strict";
    var hello;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            exports_1("hello", hello = "Hello!");
        }
    };
});
System.register("main", ["hello", "rxjs"], function (exports_2, context_2) {
    "use strict";
    var hello_1, rxjs_1, s;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [
            function (hello_1_1) {
                hello_1 = hello_1_1;
            },
            function (rxjs_1_1) {
                rxjs_1 = rxjs_1_1;
            }
        ],
        execute: function () {
            s = new rxjs_1.default.Subject();
            s.pipe(rxjs_1.default.operators.map(x => x + x)).subscribe(console.log);
            s.next(hello_1.hello);
            s.next(hello_1.hello);
            s.next(hello_1.hello);
            s.next(hello_1.hello);
        }
    };
});
//# sourceMappingURL=app.js.map