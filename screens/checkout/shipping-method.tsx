import { Text, TouchableOpacity, View } from 'react-native';

type ShippingMethod = {
	id: string;
	title: string;
	description: string;
	price: number;
};

export function ShippingMethodCard({
	shippingMethod,
	isActive,
	onPress,
}: {
	shippingMethod: ShippingMethod;
	isActive: boolean;
	onPress: () => void;
}) {
	return (
		<TouchableOpacity
			className={`bg-white p-4 rounded-lg gap-3 flex-row border border-transparent items-center ${isActive ? 'border-primary-dark' : ''}`}
			activeOpacity={0.8}
			onPress={onPress}
		>
			<View className='flex-1 flex-row items-center gap-3'>
				<View className='flex-1 gap-1'>
					<Text className='text-base font-medium capitalize'>
						{shippingMethod.title}
					</Text>
					<Text className='text-xs text-text'>
						{shippingMethod.description}
					</Text>
				</View>
			</View>
			<View className='grid-cols-1'>
				<Text className='text-base text-primary-dark font-medium'>
					${shippingMethod.price}
				</Text>
			</View>
		</TouchableOpacity>
	);
}
