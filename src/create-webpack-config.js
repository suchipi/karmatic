import path from "path";
import delve from "dlv";
import { tryRequire } from "./util";
import babelLoader from "./babel-loader";
import cssLoader from "./css-loader";
import builtinAliases from "./builtin-aliases";

function dedupeArray(arr) {
  return arr.filter((value, index) => arr.indexOf(value) === index);
}

function getExistingWebpackConfig(options) {
  const WEBPACK_CONFIGS = ["webpack.config.babel.js", "webpack.config.js"];
  let webpackConfig = options.webpackConfig; // Node API option

  let packageJson = tryRequire(path.resolve(process.cwd(), "package.json"));

  if (packageJson.scripts) {
    for (let i in packageJson.scripts) {
      const script = packageJson.scripts[i];
      if (/\bwebpack\b[^&|;]*(-c|--config)\b/.test(script)) {
        const matches = script.match(
          /(?:-c|--config)\s+(?:([^\s])|(["'])(.*?)\2)/
        );
        const configFile = matches && (matches[1] || matches[2]);
        if (configFile) WEBPACK_CONFIGS.push(configFile);
      }
    }
  }

  if (!webpackConfig) {
    for (let i = WEBPACK_CONFIGS.length; i--; ) {
      webpackConfig = tryRequire(
        path.resolve(process.cwd(), WEBPACK_CONFIGS[i])
      );
      if (webpackConfig) break;
    }
  }

  return webpackConfig || {};
}

export default function createWebpackConfig(options) {
  let files = options.files.filter(Boolean);
  if (!files.length) {
    files = ["**/{*.test.js,*_test.js}"];
  }

  const webpackConfig = getExistingWebpackConfig(options);

  const loaders = [].concat(
    delve(webpackConfig, "module.loaders") || [],
    delve(webpackConfig, "module.rules") || []
  );

  function evaluateCondition(condition, filename, expected) {
    if (typeof condition === "function") {
      return condition(filename) == expected;
    } else if (condition instanceof RegExp) {
      return condition.test(filename) == expected;
    }
    if (Array.isArray(condition)) {
      for (let i = 0; i < condition.length; i++) {
        if (evaluateCondition(condition[i], filename)) return expected;
      }
    }
    return !expected;
  }

  function getLoader(predicate) {
    if (typeof predicate === "string") {
      let filename = predicate;
      predicate = loader => {
        let { test, include, exclude } = loader;
        if (exclude && evaluateCondition(exclude, filename, false))
          return false;
        if (include && !evaluateCondition(include, filename, true))
          return false;
        if (test && evaluateCondition(test, filename, true)) return true;
        return false;
      };
    }
    for (let i = 0; i < loaders.length; i++) {
      if (predicate(loaders[i])) {
        return { index: i, loader: loaders[i] };
      }
    }
    return null;
  }

  function webpackProp(name, value) {
    const configured = delve(webpackConfig, name);
    if (Array.isArray(value)) {
      return dedupeArray(value.concat(configured || []));
    } else if (value != null) {
      return Object.assign({}, configured || {}, value);
    } else {
      return configured;
    }
  }

  return {
    devtool: "inline-source-map",
    module: {
      loaders: loaders
        .concat(
          getLoader(rule =>
            `${rule.use},${rule.loader}`.match(/\bbabel-loader\b/)
          )
            ? null
            : babelLoader(options),
          getLoader("foo.css") ? null : cssLoader(options)
        )
        .filter(Boolean)
    },
    resolve: webpackProp("resolve", {
      modules: webpackProp("resolve.modules", [
        "node_modules",
        path.resolve(__dirname, "../node_modules")
      ]),
      alias: Object.assign(builtinAliases(), webpackProp("resolve.alias"))
    }),
    resolveLoader: webpackProp("resolveLoader", {
      modules: webpackProp("resolveLoader.modules", [
        "node_modules",
        path.resolve(__dirname, "../node_modules")
      ])
    }),
    plugins: (webpackConfig.plugins || []).filter(plugin => {
      const name = plugin.constructor.name;
      return /^\s*(UglifyJS|HTML|ExtractText|BabelMinify)(.*Webpack)?Plugin\s*$/gi.test(
        name
      );
    })
  };
}
