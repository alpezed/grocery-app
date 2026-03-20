import { getTransactions } from '@/services/transactions';
import { useUser } from '@clerk/clerk-expo';
import { useQuery } from '@tanstack/react-query';

export const useTransactions = () => {
	const { user } = useUser();
	return useQuery({
		queryKey: ['transactions', user?.id],
		queryFn: () => getTransactions(user?.id!),
		enabled: !!user?.id,
	});
};
