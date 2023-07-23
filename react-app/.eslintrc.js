module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: ["plugin:react/recommended", "airbnb", "prettier"],
	overrides: [],
	parserOptions: {
		ecmaVersioen: "latest",
		sourceType: "module",
	},
	plugins: ["react", "prettier"],
	rules: {
		"react/jsx-filename-extension": "off",
		"react/jsx-props-no-spreading": "off",
		"react/function-component-definition": "off",
		"arrow-body-style": "off",
		"react/prop-types": "off",
		"react/self-closing-comp": "off",
		"no-console": "off",
		"no-nested-ternary": "off",
		"import/no-extraneous-dependencies": "off",
		"react/no-array-index-key": "off",
		"import/no-dynamic-require": "off",
		"global-require": "off",
	},
};
