/*!
 * Copyright (c) 2018 Adrian Panella <ianchi74@outlook.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { INode, keyedObject } from 'espression';

import { JsonPathStaticEval } from './eval';
import { JsonPathResult } from './jsonPathResult';
import { ESPathParser, JsonPathParser } from './parserRules';

export class JsonPath {
  static jpEval = new JsonPathStaticEval();

  static jpParser = new JsonPathParser();

  static espParser = new ESPathParser();

  evaluate(ast: INode, ctx: keyedObject): any {
    return JsonPath.jpEval.evaluate(ast, ctx);
  }

  parse(path: string): INode {
    return JsonPath.espParser.parse(path);
  }

  eval(path: string, ctx: keyedObject): any {
    return JsonPath.jpEval.evaluate(JsonPath.espParser.parse(path), ctx);
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  query(obj: object, path: string): JsonPathResult {
    return <JsonPathResult>JsonPath.jpEval.evaluate(JsonPath.jpParser.parse(path), { $: obj });
  }
}

export { JsonPathStaticEval } from './eval';
export { JsonPathResult } from './jsonPathResult';
export { ESPathParser, JsonPathParser } from './parserRules';
