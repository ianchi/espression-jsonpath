/**
 * Copyright (c) 2018 Adrian Panella <ianchi74@outlook.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import {
  BinaryOperatorRule,
  esNextRules,
  EXPRESSION,
  EXPRESSIONS,
  ICharClass,
  IConfBinaryOp,
  IdentifierRule,
  IRuleSet,
  LITERAL_EXP,
  MultiOperatorRule,
  NOCOMMA_EXPR,
  NumberRule,
  OBJECT,
  opConf,
  Parser,
  PROPERTY,
  STATEMENT,
  StringRule,
  TOKEN,
  UnaryOperatorRule,
  UNARY_EXP,
  UNARY_TYPE_PRE,
} from 'espression';

export const JPCHILD_EXP = 'JPChildExpression',
  JPDESC_EXP = 'JPDescendantExpression',
  JPUNION_EXP = 'JPUnionExpression',
  JPFILTER_EXP = 'JPFilterExpression',
  JPSLICE_EXP = 'JPSliceExpression',
  JPWILDCARD_EXP = 'JPWildcard',
  JPEXP_EXP = 'JPExpression';

const COMPUTED_CONF: IConfBinaryOp = {
    type: JPCHILD_EXP,
    left: OBJECT,
    right: PROPERTY,
    extra: { computed: true },
    subRules: 'computed',
    close: ']',
  },
  MEMBER_CONF: IConfBinaryOp = {
    type: JPCHILD_EXP,
    left: OBJECT,
    right: PROPERTY,
    extra: { computed: false },
    subRules: JPCHILD_EXP,
  };

export function jsonPathRules(identStart?: ICharClass, identPart?: ICharClass): IRuleSet {
  // properties can have reserved words as names
  const wildcardRule = new IdentifierRule({
    typeIdent: JPWILDCARD_EXP,
    identStart: { re: /[*]/, re2: undefined },
    identPart: { re: /[]/, re2: undefined },
  });

  // adds '@' as valid identifier start
  const rules = esNextRules({ ...identStart, re: /[@$_A-Za-z]/ }, identPart);
  rules[JPEXP_EXP] = [
    new BinaryOperatorRule({
      '.': MEMBER_CONF,
      '[': COMPUTED_CONF,
      '..': { ...MEMBER_CONF, type: JPDESC_EXP },
      '..[': { ...COMPUTED_CONF, type: JPDESC_EXP },
    }),
    new UnaryOperatorRule({ '(': { close: ')', subRules: EXPRESSION, type: 'JProotExpr' } }),
    new IdentifierRule({ typeIdent: 'JPRoot' }),
  ];
  rules[JPCHILD_EXP] = [new IdentifierRule(), wildcardRule];

  rules.computed = [
    new MultiOperatorRule({
      type: JPUNION_EXP,
      prop: EXPRESSIONS,
      separators: ',',
    }),
    new UnaryOperatorRule({
      '(': {
        type: JPEXP_EXP,
        prop: EXPRESSION,
        close: ')',
        subRules: NOCOMMA_EXPR,
      },
    }),
    new UnaryOperatorRule({
      '?(': {
        type: JPFILTER_EXP,
        prop: EXPRESSION,
        close: ')',
        subRules: NOCOMMA_EXPR,
      },
    }),
    new MultiOperatorRule({
      type: JPSLICE_EXP,
      prop: EXPRESSIONS,
      separators: ':',
      sparse: true,
      trailling: true,
      maxSep: 2,
      types: [LITERAL_EXP, UNARY_EXP],
    }),
    new UnaryOperatorRule(opConf(['-', '+'], UNARY_TYPE_PRE)),
    new NumberRule({ radix: 10, decimal: false }),
    new StringRule(),
    wildcardRule,
  ];

  return rules;
}


/**
 * Extended ES-next parser.
 *  add the '<$..path>' notation as jsonPath literal, with priority as first token
 * 
 */
export class ESPathParser extends Parser {
  constructor() {
    const esPathRules = jsonPathRules();


    esPathRules[TOKEN].unshift(new UnaryOperatorRule({ '<': { close: '>', subRules: JPEXP_EXP } }));
    super(esPathRules, STATEMENT);
  }
}
// tslint:disable-next-line:max-classes-per-file
export class JsonPathParser extends Parser {
  constructor() {
    super(jsonPathRules(), JPEXP_EXP);
  }
}
