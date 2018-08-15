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
import { jsonPathFactory } from 'espression';

const jp = jsonPathFactory();

let result = jp.jsonPath({a:1, b:2, c:3, d: [1,2,3]}, '$..d[:-1]');
```

The query returns a `jsonPath` object with the following properties:

- `values`: array of matching values
- `paths`: array of matching paths (each an array of strings with the keys)
- `root`: the object being queried

This is shorthand for:

```
import { jsonPathParserFactory, jsonPathEvalFactory } from 'espression';

const parser = jsonPathParserFactory();
const staticEval = jsonPathEvalFactory();

let ast = parser.parse('$..d[:-1]');
let result = staticEval.eval(ast, {$: {a:1, b:2, c:3, d: [1,2,3]}});
```

### mixed expressions

This preset introduces a new syntax to mix jsonPath inside a normal ES5 expression with a jsonPath literal notation. It is a regular jsonPath expression enclosed in `<>`, it returns a `jsonPath` object as described above.

```
import { jsonPathFactory } from 'espression';

const jp = jsonPathFactory();

let result = jp.evaluate('x + <z..d[:-1]>.values[0]', {x: 10, z: {a:1, b:2, c:3, d: [1,2,3]}});
```

This is shorthand for:

```
import { es5PathParserFactory, jsonPathEvalFactory } from 'espression';

const parser = es5PathParserFactory();
const staticEval = jsonPathEvalFactory();

let ast = parser.parse('x + <z..d[:-1]>.values[0]');
let result = staticEval.eval(ast, {x: 10, z: {a:1, b:2, c:3, d: [1,2,3]}});
```

## Bundling

Each of these components is fully independent, so that when included with es6 imports, your final bundle can then be tree shaken, and only the used presets/rules included.

## License

[MIT](LICENSE).
