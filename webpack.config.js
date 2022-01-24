

module.exports = {
    devtool: "inline-source-map",
    mode: "development",
    entry: {
		name: "./js/index.js"
	},
    output: {
		filename: 'bundle.js'
	},
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  }

}