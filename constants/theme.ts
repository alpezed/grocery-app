/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
	light: {
		text: '#868889',
		background: '#fff',
		backgroundLight: '#F4F5F9',
		backgroundDark: '#F5F5F5',
		tint: tintColorLight,
		icon: '#687076',
		tabIconDefault: '#687076',
		tabIconSelected: tintColorLight,
		primary: '#AEDC81',
		primaryDark: '#6CC51D',
		primaryLight: '#EBFFD7',
		border: '#EBEBEB',
		link: '#407EC7',
		heart: '#FE585A',
		badgeText: '#E8AD41',
		badgeBg: '#FDEFD5',
		rating: '#FFC107',
		accentRed: '#EF574B',
	},
	dark: {
		text: '#868889',
		background: '#fff',
		backgroundLight: '#F4F5F9',
		backgroundDark: '#F5F5F5',
		tint: tintColorDark,
		icon: '#9BA1A6',
		tabIconDefault: '#9BA1A6',
		tabIconSelected: tintColorDark,
		primary: '#AEDC81',
		primaryDark: '#6CC51D',
		primaryLight: '#EBFFD7',
		border: '#EBEBEB',
		link: '#407EC7',
		heart: '#FE585A',
		badgeText: '#E8AD41',
		badgeBg: '#FDEFD5',
		rating: '#FFC107',
		accentRed: '#EF574B',
	},
};

export const Fonts = Platform.select({
	ios: {
		/** iOS `UIFontDescriptorSystemDesignDefault` */
		sans: 'system-ui',
		/** iOS `UIFontDescriptorSystemDesignSerif` */
		serif: 'ui-serif',
		/** iOS `UIFontDescriptorSystemDesignRounded` */
		rounded: 'Montserrat-Bold',
		/** iOS `UIFontDescriptorSystemDesignMonospaced` */
		mono: 'ui-monospace',
	},
	default: {
		sans: 'normal',
		serif: 'serif',
		rounded: 'normal',
		mono: 'monospace',
	},
	web: {
		sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
		serif: "Georgia, 'Times New Roman', serif",
		rounded: 'Montserrat-Bold',
		mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
	},
});
