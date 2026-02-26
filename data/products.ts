export const PRODUCTS = [
	{
		id: 'p1',
		categoryId: 'fruits',
		name: 'Fresh Peach',
		price: 8.0,
		unit: 'dozen',
		image: require('../assets/images/products/peach.png'),
		isNew: false,
		discount: null,
	},
	{
		id: 'p2',
		categoryId: 'fruits',
		name: 'Avacoda', // Kept your spelling from the image!
		price: 7.0,
		unit: '2.0 lbs',
		image: require('../assets/images/products/peach.png'),
		isNew: true,
		discount: null,
	},
	{
		id: 'p3',
		categoryId: 'fruits',
		name: 'Pineapple',
		price: 9.9,
		unit: '1.50 lbs',
		image: require('../assets/images/products/peach.png'),
		isNew: false,
		isFavorite: true,
		discount: null,
	},
	{
		id: 'p4',
		categoryId: 'fruits',
		name: 'Black Grapes',
		price: 7.05,
		unit: '5.0 lbs',
		image: require('../assets/images/products/peach.png'),
		isNew: false,
		discount: 16, // percentage
	},
	{
		id: 'p5',
		categoryId: 'fruits',
		name: 'Pomegranate',
		price: 2.09,
		unit: '1.50 lbs',
		image: require('../assets/images/products/peach.png'),
		isNew: true,
		discount: null,
	},
	{
		id: 'p6',
		categoryId: 'vegetables',
		name: 'Fresh B roccoli', // Kept your spelling from the image!
		price: 3.0,
		unit: '1 kg',
		image: require('../assets/images/products/peach.png'),
		isNew: false,
		isFavorite: true,
		discount: null,
	},
];

export type Product = (typeof PRODUCTS)[number];
