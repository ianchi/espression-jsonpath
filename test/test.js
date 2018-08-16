const jp = require('../dist/bundle/espression-jsonpath.cjs');

const exprs = require('./data');

testJsonPath(exprs);

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
  console.log('Passed: ' + ok + '/' + exprs.length);
  return ok === exprs.length;
}
