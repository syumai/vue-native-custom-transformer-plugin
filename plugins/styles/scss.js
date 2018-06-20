let sass;

let initialized = false;

const { require: requireFromAppRoot } = require('app-root-path');

function init() {
  sass = requireFromAppRoot('./node_modules/node-sass');
  initialized = true;
}

function transform(content, options) {
  if (!initialized) {
    init();
  }

  options = Object.assign(
    {
      data: content,
    },
    options || {}
  );

  if (sass) {
    return sass.renderSync(options);
  } else {
    throw new Error(
      `failed to load node-sass! please add node-sass as a dependency.`
    );
  }
}

module.exports = transform;
