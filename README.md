# ESpression-jsonPath

_[ESpression](https://github.com/ianchi/espression) preset to parse and eval [jsonPath expressions](http://goessner.net/articles/JsonPath/index.html#e2)._

Try it live at [ESpression Tester](https://ianchi.github.io/ESpression-tester/)

## Usage

jsonPath expressions can be handled in two ways:

- pure jsonPath expressions: `$..member`
- mixed ES5 expressions with jsonPath: `a + <$..member>.values[0] * 2`

### pure jsonPath expressions

In this case only a valid jsonPath expression is allowed in the parser.

```
import { JsonPath } from 'espression-jsonpath';

const jp = new JsonPath();

let result = jp.query({a:1, b:2, c:3, d: [1,2,3]}, '$..d[:-1]');
```

The query returns a `JsonPathResult` object with the following properties:

- `values`: array of matching values
- `paths`: array of matching paths (each an array of strings with the keys)
- `root`: the object being queried

This is shorthand for:

```
import { JsonPathParser, JsonPathStaticEval } from 'espression-jsonpath';

const parser = new JsonPathParser();
const staticEval = JsonPathStaticEval();

let ast = parser.parse('$..d[:-1]');
let result = staticEval.evaluate(ast, {$: {a:1, b:2, c:3, d: [1,2,3]}});
```

### mixed expressions

This preset introduces a new syntax to mix jsonPath inside a normal ES5 expression with a jsonPath literal notation. It is a regular jsonPath expression enclosed in `<>`, it returns a `jsonPath` object as described above.

```
import { JsonPath } from 'espression-jsonpath';

const jp = new JsonPath();

let result = jp.eval('x + <z..d[:-1]>.values[0]', {x: 10, z: {a:1, b:2, c:3, d: [1,2,3]}});
```

This is shorthand for:

```
import { ES5PathParser, JsonPathStaticEval } from 'espression-jsonpath';

const parser = new ES5PathParser();
const staticEval = new JsonPathStaticEval();

let ast = parser.parse('x + <z..d[:-1]>.values[0]');
let result = staticEval.evaluate(ast, {x: 10, z: {a:1, b:2, c:3, d: [1,2,3]}});
```

## Bundling

Each of these components is fully independent, so that when included with es6 imports, your final bundle can then be tree shaken, and only the used presets/rules included.

## License

[MIT](LICENSE).
