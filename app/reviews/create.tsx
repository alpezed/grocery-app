import AppHeader from '@/components/app-header';
import { Button } from '@/components/ui/button';
import { Colors } from '@/constants/theme';
import { useCreateReview } from '@/lib/queries/products';
import { Review, reviewSchema } from '@/schema/review.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Rating } from '@kolking/react-native-rating';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import {
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	Text,
	TextInput,
	TouchableWithoutFeedback,
	View,
} from 'react-native';

export default function WriteReview() {
	const router = useRouter();
	const {
		control,
		handleSubmit,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<Review>({
		resolver: zodResolver(reviewSchema),
		defaultValues: {
			rating: 0,
			review: '',
		},
	});

	const { productId, clerkId } = useLocalSearchParams<{
		productId: string;
		clerkId: string;
	}>();
	const { mutateAsync: createReview } = useCreateReview(productId);
	const rating = useWatch({ control, name: 'rating' });
	const handleChange = useCallback(
		(value: number) => {
			setValue('rating', Math.round((rating + value) * 5) / 10);
		},
		[setValue, rating]
	);

	const onSubmit = async (data: Review) => {
		console.log(data);
		if (!productId || !clerkId) return;
		await createReview({
			...data,
			product: productId,
			clerkId: clerkId,
		});
		router.back();
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			className='flex-1'
		>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View className='flex-1'>
					<AppHeader title='Write a Review' showBack={true} />
					<View className='flex-1 justify-center px-4 gap-8'>
						<View className='items-center gap-3'>
							<Text className='font-sans-bold text-xl'>
								What do you think ?
							</Text>
							<Text className='text-text font-sans text-sm px-6 text-center'>
								please give your rating by clicking on the stars below
							</Text>
							<Rating
								size={28}
								rating={rating}
								onChange={handleChange}
								fillColor={Colors.light.rating}
								variant='stars-outline'
								baseColor={Colors.light.rating}
								touchColor={Colors.light.rating}
							/>
							{errors.rating && (
								<Text className='text-red-500 font-sans text-sm'>
									{errors.rating.message}
								</Text>
							)}
						</View>
						<View className='gap-3'>
							<View className='h-40'>
								<Controller
									control={control}
									name='review'
									render={({ field: { onChange, onBlur, value } }) => (
										<TextInput
											placeholder='Tell us about your experience'
											multiline={true}
											numberOfLines={4}
											className={`flex-1 bg-white h-40 p-4 rounded-lg border border-transparent ${errors.review ? 'border-red-500' : ''}`}
											placeholderTextColor={Colors.light.text}
											onChangeText={onChange}
											onBlur={onBlur}
											value={value}
										/>
									)}
								/>
								{errors.review && (
									<Text className='text-red-500 font-sans text-sm'>
										{errors.review.message}
									</Text>
								)}
							</View>
							<Button onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
								{isSubmitting ? 'Submitting...' : 'Submit Review'}
							</Button>
						</View>
					</View>
				</View>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
}
