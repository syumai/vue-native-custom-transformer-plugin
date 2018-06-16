const scssTransform = require('./scss.js');

function transform(content, options) {
  options = Object.assign(
    {
      indentedSyntax: true,
    },
    options || {}
  );
  return scssTransform(content, options);
}

module.exports = transform;
