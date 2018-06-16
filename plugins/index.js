const registeredPlugins = {
  initialized: false,
  template: {},
  script: {},
  styles: {},
};

function registerPlugin(moduleName, plugin) {
  const { lang, transform } = plugin;
  if (!lang) {
    console.error(`plugin lang is required. plugin was not registered.`);
    return;
  }
  if (typeof transform !== 'function') {
    console.error(
      `plugin transform must be function. plugin was not registered.`
    );
    return;
  }
  registeredPlugins[lang] = transform;
}

function registerBuitinPlugin(moduleName, lang) {
  let pluginPath;
  try {
    pluginPath = require.resolve(`../plugins/${moduleName}/${lang}.js`);
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      console.error(`plugin of '${lang}' was not found`);
      return;
    }
    throw e;
  }
  const transform = require(pluginPath);
  const plugin = {
    lang,
    transform,
  };
  registerPlugin(moduleName, plugin);
}

function initializePlugins(plugins) {
  registeredPlugins.initialized = true;

  if (!Array.isArray(plugins)) {
    plugins = [plugins];
  }

  for (const [moduleName, modulePlugins] of Object.entries(plugins)) {
    if (!modulePlugins) {
      continue;
    }

    for (const plugin of modulePlugins) {
      if (typeof plugin === 'string') {
        registerBuitinPlugin(moduleName, plugin);
        continue;
      }
      registerPlugin(moduleName, plugin);
    }
  }
}

module.exports = {
  registeredPlugins,
  initializePlugins,
};
