import path from "path";
import delve from "dlv";
import { tryRequire, dedupe } from "./util";
import babelLoader from "./babel-loader";
import cssLoader from "./css-loader";
import builtinAliases from "./builtin-aliases";

export default function createWebpackConfig(options) {
  let cwd = process.cwd(),
    res = file => path.resolve(cwd, file);

  let files = options.files.filter(Boolean);
  if (!files.length) files = ["**/{*.test.js,*_test.js}"];

  const WEBPACK_CONFIGS = ["webpack.config.babel.js", "webpack.config.js"];
  let webpackConfig = options.webpackConfig;

  let pkg = tryRequire(res("package.json"));

  if (pkg.scripts) {
    for (let i in pkg.scripts) {
      let script = pkg.scripts[i];
      if (/\bwebpack\b[^&|]*(-c|--config)\b/.test(script)) {
        let matches = script.match(
          /(?:-c|--config)\s+(?:([^\s])|(["'])(.*?)\2)/
        );
        let configFile = matches && (matches[1] || matches[2]);
        if (configFile) WEBPACK_CONFIGS.push(configFile);
      }
    }
  }

  if (!webpackConfig) {
    for (let i = WEBPACK_CONFIGS.length; i--; ) {
      webpackConfig = tryRequire(res(WEBPACK_CONFIGS[i]));
      if (webpackConfig) break;
    }
  }

  webpackConfig = webpackConfig || {};

  let loaders = [].concat(
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
    return false;
  }

  function webpackProp(name, value) {
    const configured = delve(webpackConfig, name);
    if (Array.isArray(value)) {
      return value.concat(configured || []).filter(dedupe);
    }
    return Object.assign({}, configured || {}, value);
  }

  return {
    devtool: "inline-source-map",
    module: {
      loaders: loaders
        .concat(
          !getLoader(rule =>
            `${rule.use},${rule.loader}`.match(/\bbabel-loader\b/)
          ) && babelLoader(options),
          !getLoader("foo.css") && cssLoader(options)
        )
        .filter(Boolean)
    },
    resolve: webpackProp("resolve", {
      modules: webpackProp("resolve.modules", [
        "node_modules",
        path.resolve(__dirname, "../node_modules")
      ]),
      alias: builtinAliases(
        webpackProp("resolve.alias", {
          [pkg.name]: res("."),
          src: res("src")
        })
      )
    }),
    resolveLoader: webpackProp("resolveLoader", {
      modules: webpackProp("resolveLoader.modules", [
        "node_modules",
        path.resolve(__dirname, "../node_modules")
      ]),
      alias: webpackProp("resolveLoader.alias", {
        [pkg.name]: res("."),
        src: res("src")
      })
    }),
    plugins: (webpackConfig.plugins || []).filter(plugin => {
      let name = plugin && plugin.constructor.name;
      return /^\s*(UglifyJS|HTML|ExtractText|BabelMinify)(.*Webpack)?Plugin\s*$/gi.test(
        name
      );
    })
  };
}
