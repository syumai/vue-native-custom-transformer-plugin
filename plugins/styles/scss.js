let sass;

try {
  sass = require('node-sass');
} catch (e) {
  console.error('node-sass not loaded');
}

function transform(content, options) {
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
