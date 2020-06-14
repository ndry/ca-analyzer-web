import {hello} from "./hello.js";
import rxjs from "rxjs";
import {Application} from "./Application.js";
import ParkMiller from "park-miller";

const s = new rxjs.Subject<string>();
s.pipe(
    rxjs.operators.map(x => x + x),
).subscribe(console.log);

s.next(hello);
s.next(hello);
s.next(hello);
s.next(hello);

const app = new Application();

const pm = new ParkMiller(10);

console.log(hello);
console.log(pm.integer());