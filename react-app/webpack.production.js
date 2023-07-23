const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
	mode: "production",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "[name]_[contenthash].js",
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: "[name]_[contenthash].css",
		}),
	],
};
