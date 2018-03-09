'use strict';
const {readFileSync} = require('fs');
const yaml = require('js-yaml');
const includeType = require('./types/include-type');
const envType = require('./types/env-type');

let schema = null;

const reader = {
  visitPath: [],

  getCurrentFile() {
    return this.visitPath[0];
  },

  readYml(filePath) {
    return this.readYmlByString(readFileSync(filePath, {encoding: 'utf8'}), filePath);
  },

  readYmlByString(input, filename) {
    const yamlConfs = input.split(/^---.*/m);
    this.visitPath.unshift(filename);

    const jsonObjects = yamlConfs.map(yamlConf => yaml.safeLoad(yamlConf, {filename, schema}));

    this.visitPath.shift();
    return jsonObjects.length === 1 ? jsonObjects[0] : jsonObjects;
  },

  doEnvReplacement(name) {
    name = name.replace(/\s/g, '');

    if (process.env[name]) {
      return process.env[name];
    }
    throw new Error('Unable to find ENV Variable \'' + name + '\'');
  }
};

schema = yaml.Schema.create([
  // Include file and fail if the file does not exist
  new yaml.Type('!include', includeType({isRequired: true, reader})),

  // Include file if the file exists
  new yaml.Type('!include?', includeType({isRequired: false, reader})),

  new yaml.Type('!env', envType({reader}))
]);

module.exports = reader;
