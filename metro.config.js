// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('@expo/metro-config');
const { withUniwindConfig } = require('uniwind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = withUniwindConfig(
	{
		...config,
		transformer: {
			babelTransformerPath: require.resolve('react-native-svg-transformer'),
		},
		resolver: {
			assetExts: config.resolver.assetExts.filter(ext => ext !== 'svg'),
			sourceExts: [...config.resolver.sourceExts, 'svg'],
		},
	},
	{
		// relative path to your global.css file (from previous step)
		cssEntryFile: './global.css',
		// (optional) path where we gonna auto-generate typings
		// defaults to project's root
		dtsFile: './app/uniwind-types.d.ts',
	}
);
