const cssParse = require('css-parse');
const parseCSS = require('vue-native-scripts/src/util/parseCss');
const constants = require('vue-native-scripts/src/util/constants');

let sass;

try {
  sass = require('node-sass');
} catch (e) {
  console.log('node-sass not loaded');
}

function transpileStylesContent(content, lang) {
  if (lang) {
    switch (lang) {
      case 'scss':
      case 'sass':
        if (sass) {
          return sass.renderSync({
            data: content,
            indentedSyntax: lang === 'sass',
          });
        } else {
          throw new Error(
            `failed to load node-sass! please add node-sass as a dependency.`
          );
        }
      default:
        throw new Error(`style type '${lang}' not supported.`);
    }
  }
  return content;
}

function parseStyles(styles) {
  const parsedStylesObj = styles.reduce((prev, curr) => {
    const { content, lang } = curr;
    const transpiledContent = transpileStylesContent(content, lang);
    const cssAST = cssParse(transpiledContent);
    return Object.assign({}, prev, parseCSS(cssAST));
  }, {});
  return `const ${constants.CSS} = ${JSON.stringify(parsedStylesObj)}`;
}

module.exports = parseStyles;
