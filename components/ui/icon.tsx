import * as icons from 'lucide-react-native/icons';
import React from 'react';
import { ColorValue } from 'react-native';
import { SvgProps } from 'react-native-svg';

type IconProps = {
	name: keyof typeof icons;
	color?: string;
	size?: number;
};

export function Icon({
	name,
	color,
	size,
	strokeWidth = 1.4,
	...props
}: IconProps & SvgProps & { strokeWidth?: number }) {
	const LucideIcon = (
		icons as Record<
			keyof typeof icons,
			React.ComponentType<{
				color?: string;
				size?: number;
				strokeWidth?: number;
				fill?: ColorValue;
				stroke?: ColorValue;
			}>
		>
	)[name];

	if (!LucideIcon) {
		throw new Error(`Icon ${name} not found`);
	}

	return (
		<LucideIcon
			color={color}
			size={size}
			{...props}
			strokeWidth={strokeWidth}
		/>
	);
}
