'use strict';
const {existsSync} = require('fs');
const {resolve} = require('path');

module.exports = ({reader, isRequired} = {}) => {
  return {
    kind: 'scalar',
    resolve: url => Boolean(url),
    construct: url => {
      url = url.replace(/\{\{([^}]*)\}\}/g, (match, name) => {
        return reader.doEnvReplacement(name);
      });

      const includeFile = resolve(reader.getCurrentFile(), '..', url);

      if (isRequired || existsSync(includeFile)) {
        return reader.readYml(includeFile);
      }

      return '';
    },
    represent: () => null
  };
};
