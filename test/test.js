const jp = require('../dist/bundle/espression-jsonpath.cjs');
const assert = require('assert');
const exprs = require('./data');
const query = require('./query');
const jsonData = require('./store.json');

const jpObj = new jp.JsonPath();

let code = true;
code = code && testJsonPath(exprs);
code = code && testQuery();

process.exit(code ? 0 : 1);

function testJsonPath(exprs) {
  const jsonPath = new jp.JsonPathParser();
  let ok = 0;
  console.log('Testing jsonPath');
  exprs.forEach(element => {
    try {
      jsonPath.parse(element);
      ok++;
    } catch (e) {
      console.log('Failed on :', element);
      console.log(e.message);
    }
  });
  console.log('Parsing test Passed: ' + ok + '/' + exprs.length);
  return ok === exprs.length;
}

function testQuery() {
  let ok = 0;
  for (const qry of query) {
    try {
      assert.deepEqual(jpObj.query(jsonData, qry.qry).values, qry.res);
      ok++;
    } catch (e) {}
  }
  console.log('Query test Passed: ' + ok + '/' + query.length);
  return ok === query.length;
}
