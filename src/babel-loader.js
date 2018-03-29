export default function babelLoader(options) {
  return {
    test: /\.jsx?$/,
    exclude: /node_modules/,
    loader: "babel-loader",
    query: {
      presets: [
        [
          require.resolve("babel-preset-env"),
          {
            targets: {
              // Our current electron version is Chrome 59.
              browsers: "Chrome >= 59"
            },
            modules: false
          }
        ],
        require.resolve("babel-preset-stage-0")
      ],
      plugins: [require.resolve("babel-plugin-transform-react-jsx")]
    }
  };
}
