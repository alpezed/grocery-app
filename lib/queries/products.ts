import { strapiService } from '@/services/strapi';
import { useQuery } from '@tanstack/react-query';

export const useProducts = () => {
	return useQuery({
		queryKey: ['products'],
		queryFn: () => strapiService.getProducts(),
	});
};
