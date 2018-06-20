const path = require('path');
const { resolve: resolveFromAppRoot } = require('app-root-path');

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
  if (transform && typeof transform !== 'function') {
    console.error(
      `plugin transform must be function. plugin was not registered.`
    );
    return;
  }
  registeredPlugins[moduleName][lang] = content => transform(content, options);
}

function registerBuitinPlugin(moduleName, plugin) {
  const { lang, options = {} } = plugin;
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

function registerPlugins(plugins) {
  for (const [moduleName, modulePlugins] of Object.entries(plugins)) {
    if (!modulePlugins) {
      continue;
    }

    for (const plugin of modulePlugins) {
      if (plugin && typeof plugin === 'string') {
        registerBuitinPlugin(moduleName, {
          lang: plugin,
        });
        continue;
      } else if (plugin && typeof plugin !== 'object') {
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

function loadConfig() {
  // load config automatically
  let configPath;
  try {
    configPath = resolveFromAppRoot('vue-native-custom-transformer.config.js');
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      console.error(
        `config file for vue-native-custom-transformer was not found`
      );
      return;
    }
  }
  return require(configPath);
}

function initializePlugins() {
  if (registeredPlugins.initialized) {
    console.error('plugins are already initialized.');
    return;
  }
  registeredPlugins.initialized = true;

  const { plugins } = loadConfig();
  if (!plugins) {
    console.error('config for vue-native-custom-transformer was not found');
    return;
  }
  registerPlugins(plugins);
}

module.exports = {
  registeredPlugins,
  initializePlugins,
};
