import {hello} from "./hello";
import rxjs from "rxjs";

const s = new rxjs.Subject<string>();
s.pipe(
    rxjs.operators.map(x => x + x),
).subscribe(console.log);

s.next(hello);
s.next(hello);
s.next(hello);
s.next(hello);