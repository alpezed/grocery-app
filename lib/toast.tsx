import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { Colors } from '@/constants/theme';

export const toastConfig = {
	// We define a 'success' type to match your theme
	success: ({ text1 }: { text1?: string }) => (
		<View
			style={{
				flexDirection: 'row',
				alignItems: 'center',
				backgroundColor: Colors.light.primaryDark, // Your brand green from Figma
				width: '80%',
				maxWidth: 340,
				paddingVertical: 12,
				paddingHorizontal: 20,
				borderRadius: 30,

				shadowColor: '#000',
				shadowOffset: { width: 0, height: 4 },
				shadowOpacity: 0.15,
				shadowRadius: 10,
				elevation: 6, // Android support
			}}
		>
			<Ionicons name='checkmark-circle-outline' size={22} color='white' />
			<Text
				style={{
					color: 'white',
					fontSize: 14,
					fontWeight: '600',
					marginLeft: 10,
					fontFamily: 'System', // Match your clean UI font
				}}
			>
				{text1}
			</Text>
		</View>
	),
};
