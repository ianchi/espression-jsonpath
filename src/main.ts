/*!
 * Copyright (c) 2018 Adrian Panella <ianchi74@outlook.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { INode, keyedObject } from 'espression';

import { JsonPathStaticEval } from './eval';
import { JsonPathResult } from './jsonPathResult';
import { ES5PathParser, JsonPathParser } from './parserRules';
export class JsonPath {
  static jpEval = new JsonPathStaticEval();
  static jpParser = new JsonPathParser();
  static espParser = new ES5PathParser();

  eval(ast: INode, ctx: keyedObject): any {
    return JsonPath.jpEval.eval(ast, ctx);
  }
  parse(expr: string): INode {
    return JsonPath.espParser.parse(expr);
  }

  evaluate(expr: string, ctx: keyedObject): any {
    return JsonPath.jpEval.eval(JsonPath.espParser.parse(expr), ctx);
  }

  query(obj: object, path: string): JsonPathResult {
    return <JsonPathResult>JsonPath.jpEval.eval(JsonPath.jpParser.parse(path), { $: obj });
  }
}

export { JsonPathStaticEval } from './eval';
export { JsonPathResult } from './jsonPathResult';
export { ES5PathParser, JsonPathParser } from './parserRules';
