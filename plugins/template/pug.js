let pug;

try {
  pug = require('pug');
} catch (e) {
  console.error('pug not loaded');
}

function transform(content, options) {
  if (pug) {
    return pug.render(content, options || {});
  } else {
    throw new Error(`failed to load pug! please add pug as a dependency.`);
  }
}

module.exports = transform;
