import { useEffect, useState } from 'react';

import { useCartStore } from '@/store/use-cart';

const MAX_QUANTITY = 10;
const MIN_QUANTITY = 1;

export const useQuantity = (documentId: string) => {
	const { items, updateItem } = useCartStore();
	const item = items.find(i => i.documentId === documentId);
	const quantityFromStore = item?.quantity ?? MIN_QUANTITY;
	const [localValue, setLocalValue] = useState<number>(quantityFromStore);

	// Sync local state when store quantity changes (e.g. same product added from another screen)
	useEffect(() => {
		setLocalValue(quantityFromStore);
	}, [quantityFromStore]);

	const handleDecrement = () => {
		if (localValue > MIN_QUANTITY) {
			setLocalValue(localValue - MIN_QUANTITY);
			updateItem(documentId, { quantity: localValue - MIN_QUANTITY });
		}
	};

	const handleIncrement = () => {
		if (localValue < MAX_QUANTITY) {
			setLocalValue(localValue + 1);
			updateItem(documentId, { quantity: localValue + 1 });
		}
	};

	const handleChangeText = (text: string) => {
		const value = parseInt(text);
		if (isNaN(value)) {
			setLocalValue(1);
		} else {
			setLocalValue(Math.max(1, Math.min(MAX_QUANTITY, value)));
			updateItem(documentId, {
				quantity: Math.max(1, Math.min(MAX_QUANTITY, value)),
			});
		}
	};

	return {
		localValue,
		handleDecrement,
		handleIncrement,
		handleChangeText,
	};
};
