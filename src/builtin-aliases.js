const path = require("path");

export default function builtinAliases() {
  const builtinLibs = [
    "assert",
    "async_hooks",
    "buffer",
    "child_process",
    "cluster",
    "crypto",
    "dgram",
    "dns",
    "domain",
    "events",
    "fs",
    "http",
    "http2",
    "https",
    "net",
    "os",
    "path",
    "perf_hooks",
    "punycode",
    "querystring",
    "readline",
    "repl",
    "stream",
    "string_decoder",
    "tls",
    "tty",
    "url",
    "util",
    "v8",
    "vm",
    "zlib"
  ];

  return builtinLibs.reduce((obj, aliasName) => {
    obj[aliasName] = path.resolve(
      __dirname,
      "builtin-aliases",
      aliasName + ".js"
    );
    return obj;
  }, {});
}
