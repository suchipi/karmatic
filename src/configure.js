import path from "path";
import { moduleDir, readFile, readDir } from "./util";
import createWebpackConfig from "./create-webpack-config";

export default function configure(options) {
  let cwd = process.cwd();

  let files = options.files.filter(Boolean);
  if (files.length === 0) files = ["**/{*.test.js,*_test.js}"];

  let gitignore = (readFile(path.resolve(cwd, ".gitignore"), "utf8") || "")
    .replace(/(^\s*|\s*$|#.*$)/g, "")
    .split("\n")
    .filter(Boolean);
  let repoRoot = (readDir(cwd) || []).filter(
    c => c[0] !== "." && c !== "node_modules" && gitignore.indexOf(c) === -1
  );
  let rootFiles = "{" + repoRoot.join(",") + "}";

  const PLUGINS = [
    "@suchipi/karma-nightmare",
    "karma-jasmine",
    "karma-spec-reporter",
    "karma-sourcemap-loader",
    "karma-webpack",
    "./jest-style-reporter"
  ];

  return {
    basePath: cwd,
    plugins: PLUGINS.map(require.resolve),
    frameworks: ["jasmine"],
    reporters: ["jest-style"],
    browsers: ["Nightmare"],

    logLevel: "ERROR",

    files: [
      {
        pattern: path.join(moduleDir("babel-polyfill"), "dist", "polyfill.js"),
        watched: false,
        included: true,
        served: true
      },
      {
        pattern: path.join(
          moduleDir("karmatic-nightmare"),
          "dist",
          "preload.js"
        ),
        watched: false,
        included: true,
        served: true
      },
      options["test-setup-script"]
        ? {
            pattern: path.resolve(process.cwd(), options["test-setup-script"]),
            watched: true,
            included: true,
            served: true
          }
        : null
    ]
      .filter(Boolean)
      .concat(
        ...files.map(pattern => {
          // Expand '**/xx' patterns but exempt node_modules and gitignored directories
          let matches = pattern.match(/^\*\*\/(.+)$/);
          if (!matches)
            return { pattern, watched: true, served: true, included: true };
          return [
            {
              pattern: rootFiles + "/" + matches[0],
              watched: true,
              served: true,
              included: true
            },
            { pattern: matches[1], watched: true, served: true, included: true }
          ];
        })
      ),

    preprocessors: {
      [rootFiles + "/**/*"]: ["webpack", "sourcemap"],
      [rootFiles]: ["webpack", "sourcemap"]
    },

    webpack: createWebpackConfig(options),

    nightmareOptions: {
      show: options["dev-tools"] || !options.headless,
      openDevTools: options["dev-tools"],
      dock: options["dev-tools"] || !options.headless,
      alwaysOnTop: false,
      webPreferences: {
        nodeIntegration: true
      }
    },

    webpackMiddleware: {
      noInfo: true
    },

    colors: true,

    client: {
      captureConsole: true,

      jasmine: {
        random: false
      }
    }
  };
}
