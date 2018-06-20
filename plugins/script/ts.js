let ts;

let initialized = false;

const { require: requireFromAppRoot } = require('app-root-path');

function init() {
  ts = requireFromAppRoot('./node_modules/typescript');
  initialized = true;
}

function transform(content, options) {
  if (!initialized) {
    init();
  }

  if (ts) {
    const customizedOptions = Object.assign(
      {},
      {
        module: ts.ModuleKind.ES2015,
        noImplicitUseStrict: true,
        target: ts.ScriptTarget.ES2017,
      },
      options || {}
    );
    const result = ts.transpileModule(content, {
      compilerOptions: customizedOptions,
    });
    return result.outputText;
  } else {
    throw new Error(
      `failed to load typescript! please add typescript as a dependency.`
    );
  }
}

module.exports = transform;
