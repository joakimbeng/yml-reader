'use strict';
const fs = require('fs');
const path = require('path');
const test = require('ava');
const parser = require('../../lib/custom-yml-reader');

test('Include Files - Optional - should include optional files', t => {
  const yamlFile = path.resolve(__dirname, 'fixtures/include-optional/include-main-test.yml');
  const expected = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'fixtures/include-optional/include-main-test-expected.json'), 'utf8'));

  const actual = parser.readYml(yamlFile);
  t.deepEqual(actual, expected);
});
