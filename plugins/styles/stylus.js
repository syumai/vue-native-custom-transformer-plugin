let stylus;

let initialized = false;

const { require: requireFromAppRoot } = require('app-root-path');

function init() {
  stylus = requireFromAppRoot('./node_modules/stylus');
  initialized = true;
}

function transform(content, options) {
  if (!initialized) {
    init();
  }

  if (stylus) {
    let s;
    if (options) {
      s = stylus(content, options);
    } else {
      s = stylus(content);
    }
    return s.render();
  } else {
    throw new Error(
      `failed to load stylus! please add stylus as a dependency.`
    );
  }
}

module.exports = transform;
