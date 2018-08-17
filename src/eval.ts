/**
 * Copyright (c) 2018 Adrian Panella <ianchi74@outlook.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ES5StaticEval, INode, keyedObject } from 'espression';

import { JPEXP_EXP, JPFILTER_EXP, JPSLICE_EXP, JPUNION_EXP, JPWILDCARD_EXP } from './parserRules';

import { JsonPathResult } from './jsonPathResult';

/**
 * Static-eval extension to evaluate JsonPath AST nodes
 */
export class JsonPathStaticEval extends ES5StaticEval {
  protected JPRoot(node: INode, context: keyedObject): JsonPathResult {
    return new JsonPathResult(context[node.name]);
  }

  protected JPChildExpression(node: INode, context: keyedObject): JsonPathResult {
    return this.evalMember(this._eval(node.object, context), node, false, context);
  }

  protected JPDescendantExpression(node: INode, context: keyedObject): JsonPathResult {
    return this.evalMember(this._eval(node.object, context), node, true, context);
  }

  protected evalMember(
    obj: JsonPathResult,
    node: INode,
    descendant: boolean,
    context: keyedObject
  ): JsonPathResult {
    const props = node.property.type === JPUNION_EXP ? node.property.expressions : [node.property];
    const childContext = Object.create(context);

    return props.reduce((acum: JsonPathResult, n: any) => {
      let ret = new JsonPathResult(obj);
      let member: any;
      switch (n.type) {
        case JPEXP_EXP:
          obj.forEach((val, path, _depth) => {
            if (typeof val === 'object') {
              childContext['@'] = val;
              member = this._eval(n.expression, childContext);
              if (member in val) ret.push(val[member], path.concat(member));
            }
          }, descendant ? undefined : 0);
          break;

        case JPFILTER_EXP:
          obj.forEach((val, path, depth) => {
            if (!depth) return; // filter applies on children
            childContext['@'] = val;
            if (this._eval(n.expression, childContext)) ret.push(val, path);
          }, descendant ? undefined : 1);
          break;

        case JPSLICE_EXP:
          const idx = n.expressions.map((i: INode) => i && this._eval(i, childContext));
          ret = obj.slice(idx[0], idx[1], idx[2], descendant);
          break;

        case JPWILDCARD_EXP:
          obj.forEach((val, path, depth) => {
            if (!depth) return; // applies on children
            ret.push(val, path);
          }, descendant ? undefined : 1);
          break;

        default:
          member = node.computed ? this._eval(n, context) : n.name;

          obj.forEach((val, path, _depth) => {
            if (Array.isArray(val) && member < 0 && val.length + member in val) {
              ret.push(val[val.length + member], path.concat(val.length + member));
            }
            if (typeof val === 'object' && member in val) {
              ret.push(val[member], path.concat(member));
            }
          }, descendant ? undefined : 0);
          break;
      }
      return acum ? acum.concat(ret) : ret;
    }, null);
  }
}
