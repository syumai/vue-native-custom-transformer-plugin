let pug;

let initialized = false;

const { require: requireFromAppRoot } = require('app-root-path');

function init() {
  pug = requireFromAppRoot('./node_modules/pug');
  initialized = true;
}

function transform(content, options) {
  if (!initialized) {
    init();
  }

  if (pug) {
    return pug.render(content, options || {});
  } else {
    throw new Error(`failed to load pug! please add pug as a dependency.`);
  }
}

module.exports = transform;
