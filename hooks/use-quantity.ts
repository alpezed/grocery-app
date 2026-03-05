import { useState } from 'react';

const MAX_QUANTITY = 10;
const MIN_QUANTITY = 1;

export const useQuantity = () => {
	const [localValue, setLocalValue] = useState<number>(MIN_QUANTITY);

	const handleDecrement = () => {
		if (localValue > MIN_QUANTITY) {
			setLocalValue(localValue - MIN_QUANTITY);
		}
	};

	const handleIncrement = () => {
		if (localValue < MAX_QUANTITY) {
			setLocalValue(localValue + 1);
		}
	};

	const handleChangeText = (text: string) => {
		const value = parseInt(text);
		if (isNaN(value)) {
			setLocalValue(1);
		} else {
			setLocalValue(Math.max(1, Math.min(MAX_QUANTITY, value)));
		}
	};

	return {
		localValue,
		handleDecrement,
		handleIncrement,
		handleChangeText,
	};
};
