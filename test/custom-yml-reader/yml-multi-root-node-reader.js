'use strict';
const fs = require('fs');
const path = require('path');
const test = require('ava');
const parser = require('../../lib/custom-yml-reader');

test('Multiple Root Nodes - should allow multiple yml root entries split by ^---.* on multilines', t => {
  const yamlFile = path.resolve(__dirname, 'fixtures/multi-root-nodes/multi-root-item-test.yml');
  const expected = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'fixtures/multi-root-nodes/multi-root-item-test.json'), 'utf8'));

  const actual = parser.readYml(yamlFile);
  t.deepEqual(actual, expected);
});
