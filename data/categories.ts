import BabycareIcon from '@/assets/images/categories/babycare.svg';
import BeveragesIcon from '@/assets/images/categories/beverages.svg';
import EdibleOilIcon from '@/assets/images/categories/edible-oil.svg';
import FruitsIcon from '@/assets/images/categories/fruits.svg';
import GroceryIcon from '@/assets/images/categories/grocery.svg';
import HouseholdIcon from '@/assets/images/categories/household.svg';
import VegetablesIcon from '@/assets/images/categories/vegetables.svg';

export const PRODUCT_CATEGORIES = [
	{
		id: 'vegetables',
		label: 'Vegetables',
		icon: VegetablesIcon,
		color: {
			primary: '#28B446',
			background: '#E6F2EA',
		},
	},
	{
		id: 'fruits',
		label: 'Fruits',
		icon: FruitsIcon,
		color: {
			primary: '#F8644A',
			background: '#FFE9E5',
		},
	},
	{
		id: 'beverages',
		label: 'Beverages',
		icon: BeveragesIcon,
		color: {
			primary: '#F5BA3C',
			background: '#FFF6E3',
		},
	},
	{
		id: 'grocery',
		label: 'Grocery',
		icon: GroceryIcon,
		color: {
			primary: '#AE80FF',
			background: '#F3EFFA',
		},
	},
	{
		id: 'edible-oil',
		label: 'Edible oil',
		icon: EdibleOilIcon,
		color: {
			primary: '#0CD4DC',
			background: '#DCF4F5',
		},
	},
	{
		id: 'household',
		label: 'Household',
		icon: HouseholdIcon,
		color: {
			primary: '#FF7EB6',
			background: '#FFE8F2',
		},
	},
	{
		id: 'babycare',
		label: 'Babycare',
		icon: BabycareIcon,
		color: {
			primary: '#1BADFF',
			background: '#D2EFFF',
		},
	},
];

export type CategoryId = (typeof PRODUCT_CATEGORIES)[number]['id'];
