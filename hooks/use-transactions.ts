import { getTransactions } from '@/services/transactions';
import { useQuery } from '@tanstack/react-query';

export const useTransactions = () => {
	return useQuery({
		queryKey: ['transactions'],
		queryFn: () => getTransactions(),
	});
};
