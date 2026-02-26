import { Alert, Image, Pressable, Text, View } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { Quantity } from '@/components/quantity';
import Ratings from '@/components/rating';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Colors } from '@/constants/theme';

export default function ProductDetail() {
	return (
		<ParallaxScrollView
			headerImage={
				<Image
					source={require('@/assets/images/banner-image-1.png')}
					className='w-full h-full'
				/>
			}
		>
			<View className='gap-1 relative'>
				<Pressable className='absolute top-0 right-0 bg-white rounded-full'>
					<Icon
						name='Heart'
						size={22}
						color={false ? 'white' : Colors.light.text}
						fill={false ? Colors.light.heart : 'none'}
						stroke={false ? Colors.light.heart : Colors.light.text}
					/>
				</Pressable>

				<Text className='text-primary-dark font-sans-medium'>$2.22</Text>
				<Text className='font-sans-medium text-xl text-gray-900'>
					Organic Lemons
				</Text>
				<Text className='text-text font-sans-medium text-sm'>1.50 lbs</Text>
				<Ratings />
			</View>
			<Text className='text-text font-sans text-sm'>
				Organic Mountain works as a seller for many organic growers of organic
				lemons. Organic lemons are easy to spot in your produce aisle. They are
				just like regular lemons, but they will usually have a few more scars on
				the outside of the lemon skin. Organic lemons are considered to be the
				world&apos;s finest lemon for juicing
			</Text>
			<Quantity />
			<Button
				onPress={() => Alert.alert('Product added to cart')}
				color='primary'
				icon={
					<Icon name='ShoppingBag' size={20} color={Colors.light.background} />
				}
			>
				Add to Cart
			</Button>
		</ParallaxScrollView>
	);
}
