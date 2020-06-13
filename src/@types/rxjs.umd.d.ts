import "rxjs";
declare module "rxjs" {
    export const operators: typeof import("rxjs/operators");
}
