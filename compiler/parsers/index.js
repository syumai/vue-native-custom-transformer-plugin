const parseTemplate = require('./parseTemplate');
const parseScript = require('./parseScript');
const parseStyles = require('./parseStyles');

function parse({ template, script, styles }) {
  return {
    parsedTemplate: parseTemplate(template),
    parsedScript: parseScript(script),
    parsedStyles: parseStyles(styles),
  };
}

module.exports = {
  parse,
  parseTemplate,
  parseScript,
  parseStyles,
};
