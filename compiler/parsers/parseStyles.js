const cssParse = require('css-parse');
const parseCSS = require('vue-native-scripts/src/util/parseCss');
const constants = require('vue-native-scripts/src/util/constants');
const { registeredPlugins } = require('../../plugins');

function transformStylesContent(content, lang) {
  if (!lang) {
    return content;
  }

  const transform = registeredPlugins.styles[lang];
  if (!transform) {
    return content;
  }
  return transform(content);
}

function parseStyles(styles) {
  const parsedStylesObj = styles.reduce((prev, curr) => {
    const { content, lang } = curr;
    const transformedContent = transformStylesContent(content, lang);
    const cssAST = cssParse(transformedContent);
    return Object.assign({}, prev, parseCSS(cssAST));
  }, {});
  return `const ${constants.CSS} = ${JSON.stringify(parsedStylesObj)}`;
}

module.exports = parseStyles;
