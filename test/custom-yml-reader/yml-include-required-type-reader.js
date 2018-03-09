'use strict';
const fs = require('fs');
const path = require('path');
const test = require('ava');
const parser = require('../../lib/custom-yml-reader');

test('Include Files - Required - should include deep nested yml', t => {
  const yamlFile = path.resolve(__dirname, 'fixtures/include-required/include-main-test.yml');
  const expected = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'fixtures/include-required/include-main-test-expected.json'), 'utf8'));

  const actual = parser.readYml(yamlFile);
  t.deepEqual(actual, expected);
});

test('Include Files - Required - should include with substituted ENV variable', t => {
  const yamlFile = path.resolve(__dirname, 'fixtures/include-required/sub-env-var-main-test.yml');
  const expected = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'fixtures/include-required/sub-env-var-main-test-expected.json'), 'utf8'));

  // Set the ENVIRONMENT ENV property
  process.env.ENVIRONMENT = 'staging';

  const actual = parser.readYml(yamlFile);
  t.deepEqual(actual, expected);
});

test('Include Files - Required - should error when env variable not found', t => {
  const yamlFile = path.resolve(__dirname, 'fixtures/include-required/sub-env-var-main-test.yml');

  // Delete the ENVIRONMENT ENV property
  delete process.env.ENVIRONMENT;

  t.throws(() => {
    parser.readYml(yamlFile);
  }, /Unable to find ENV Variable 'ENVIRONMENT'/);
});

test('Include Files - Required - should error when include not found', t => {
  const yamlFile = path.resolve(__dirname, 'fixtures/include-required/error-include-not-exists-test.yml');

  t.throws(() => {
    parser.readYml(yamlFile);
  }, /ENOENT:.*/);
});
