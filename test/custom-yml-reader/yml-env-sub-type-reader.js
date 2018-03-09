'use strict';
const fs = require('fs');
const path = require('path');
const test = require('ava');
const parser = require('../../lib/custom-yml-reader');

test('Env Substitutions - should substitute environment variables', t => {
  const yamlFile = path.resolve(__dirname, 'fixtures/env/substitute-env-var-test.yml');
  const expected = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'fixtures/env/substitute-env-var-test-expected.json'), 'utf8'));

  process.env.MY_SERVICE_HOST = 'Test Host';
  const actual = parser.readYml(yamlFile);
  t.deepEqual(actual, expected);
});

test('Env Substitutions - should error when environment variable not found', t => {
  const yamlFile = path.resolve(__dirname, 'fixtures/env/substitute-env-var-test.yml');

  delete process.env.MY_SERVICE_HOST;

  t.throws(() => {
    parser.readYml(yamlFile);
  }, /Unable to find ENV Variable 'MY_SERVICE_HOST'/);
});
