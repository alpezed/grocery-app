import * as icons from 'lucide-react-native/icons';
import React from 'react';

type IconProps = {
	name: keyof typeof icons;
	color?: string;
	size?: number;
};

export default function icon({ name, color, size }: IconProps) {
	const LucideIcon = (
		icons as Record<
			keyof typeof icons,
			React.ComponentType<{
				color?: string;
				size?: number;
				strokeWidth?: number;
			}>
		>
	)[name];

	if (!LucideIcon) {
		throw new Error(`Icon ${name} not found`);
	}

	return <LucideIcon color={color} size={size} strokeWidth={1.5} />;
}
