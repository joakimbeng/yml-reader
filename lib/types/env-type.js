'use strict';
module.exports = ({reader} = {}) => {
  return {
    kind: 'scalar',
    resolve: name => Boolean(name),
    construct: name => {
      if (name.includes('{{')) {
        return name.replace(/\{\{([^}]*)\}\}/g, (match, name) => reader.doEnvReplacement(name));
      }
      return reader.doEnvReplacement(name);
    },
    represent: () => null
  };
};
