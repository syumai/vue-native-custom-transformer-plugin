const registeredPlugins = {
  initialized: false,
  template: {},
  script: {},
  styles: {},
};

function registerPlugin(moduleName, plugin) {
  const { lang, transform, options } = plugin;
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
  registeredPlugins[lang] = content => transform(content, options);
}

function registerBuitinPlugin(moduleName, plugin) {
  const { lang, options } = plugin;
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
  const foundPlugin = {
    lang,
    transform,
    options,
  };
  registerPlugin(moduleName, foundPlugin);
}

function initializePlugins(plugins) {
  if (registeredPlugins.initialized) {
    console.error('plugins are already initialized.');
    return;
  }
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
        registerBuitinPlugin(moduleName, {
          lang: plugin,
        });
        continue;
      } else if (typeof plugin !== 'object') {
        console.error('plugin type is not valid.');
        continue;
      }
      if (plugin.transform) {
        registerPlugin(moduleName, plugin);
        continue;
      }
      registerBuitinPlugin(moduleName, plugin);
    }
  }
}

module.exports = {
  registeredPlugins,
  initializePlugins,
};
