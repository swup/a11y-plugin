const webpack = require('webpack');
const baseConfig = require('@swup/webpack-config');

const PascalCaseName = 'SwupA11yPlugin';

const config = Object.assign({}, baseConfig, {
	entry: {
		[PascalCaseName]: './entry.js',
		[`${PascalCaseName}.min`]: './entry.js'
	},
	output: {
		path: __dirname + '/dist/',
		library: PascalCaseName,
		libraryTarget: 'umd',
		filename: '[name].js'
	}
});

module.exports = config;
