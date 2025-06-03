export class ResultPagination<T> {
    constructor(
        public data: Array<T>,
        public totalPages: number,
        public currentPage: number,
        public perPage: number,
        public totalItems?: number,
    ) {}
}