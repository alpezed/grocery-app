import AppHeader from '@/components/app-header';
import EmptyState from '@/components/empty-state';
import { Colors } from '@/constants/theme';
import { useTransactions } from '@/hooks/use-transactions';
import { format, fromUnixTime } from 'date-fns';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, View } from 'react-native';
import { PaymentIcon } from 'react-native-payment-card-icons';

export const getTransactionIcon = (brand: string) => {
	switch (brand.toLowerCase()) {
		case 'mastercard':
			return (
				<PaymentIcon type='mastercard' variant='logo' width={42} height={42} />
			);
		case 'visa':
			return <PaymentIcon type='visa' variant='logo' width={42} height={42} />;
		case 'amex':
			return <PaymentIcon type='amex' variant='logo' width={42} height={42} />;
		case 'paypal':
			return (
				<PaymentIcon type='paypal' variant='logo' width={42} height={42} />
			);
		default:
			// Fallback for bank transfers or unknown types
			return (
				<PaymentIcon
					type='generic-card'
					variant='logo'
					width={42}
					height={42}
				/>
			);
	}
};

export default function TransactionsScreen() {
	const router = useRouter();
	const { data: transactions, status, error } = useTransactions();

	useEffect(() => {
		if (error) {
			Alert.alert('Error', 'Failed to fetch transactions');
		}
	}, [error, router]);

	if (status === 'success' && transactions?.data.length === 0) {
		return (
			<View className='flex-1'>
				<AppHeader title='Transactions' />
				<View className='flex-1'>
					<EmptyState>
						<EmptyState.Icon
							icon='CreditCard'
							size={120}
							color={Colors.light.primaryDark}
						/>
						<EmptyState.Title>No transactions found</EmptyState.Title>
						<EmptyState.Description>
							You have not made any transactions yet.
						</EmptyState.Description>
					</EmptyState>
				</View>
			</View>
		);
	}

	return (
		<View className='flex-1'>
			<AppHeader title='Transactions' />
			<View className='flex-1'>
				{status === 'error' && (
					<EmptyState>
						<EmptyState.Icon
							icon='TriangleAlert'
							size={120}
							color={Colors.light.accentRed}
						/>
						<EmptyState.Title>Error fetching transactions</EmptyState.Title>
						<EmptyState.Description>
							Please try again later
						</EmptyState.Description>
					</EmptyState>
				)}
				{status === 'pending' && (
					<View className='flex-1 justify-center gap-4 px-4 py-8'>
						<ActivityIndicator size='large' color={Colors.light.primaryDark} />
					</View>
				)}
				{status === 'success' && (
					<ScrollView className='flex-1'>
						<View className='gap-3 pt-6 flex-1 px-4 pb-6'>
							{transactions?.data.map(transaction => (
								<View
									key={transaction.id}
									className='bg-white p-4 rounded-sm gap-3 flex-row items-center'
								>
									<View className='flex-1 flex-row items-center gap-3'>
										<View className='w-[50px] h-[50px] bg-background-dark rounded-full items-center justify-center'>
											{getTransactionIcon(transaction.brand)}
										</View>
										<View className='flex-1'>
											<Text className='text-base font-medium capitalize'>
												{transaction.brand}
											</Text>
											<Text className='text-xs text-text'>
												{format(
													fromUnixTime(transaction.date),
													"MMM d, yyyy 'at' h:mm aaa"
												)}
											</Text>
										</View>
									</View>
									<View className='grid-cols-1'>
										<Text className='text-base text-primary-dark font-medium'>
											{transaction.amount.toLocaleString('en-US', {
												style: 'currency',
												currency: transaction.currency,
											})}
										</Text>
									</View>
								</View>
							))}
						</View>
					</ScrollView>
				)}
			</View>
		</View>
	);
}
