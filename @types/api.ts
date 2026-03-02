export type APIResponse<T, M = Meta> = {
	data: T;
	meta: M;
};

export type Meta = {
	pagination: Pagination;
};

export type Pagination = {
	page: number;
	pageSize: number;
	pageCount: number;
	total: number;
};
