export class Pagination {
    page: number;
    size: number;
    sort?: string[];
}

export class PaginationResponce {
    content: any[];
    empty: boolean;
    first: boolean;
    last: boolean;
    number: number;
    numberOfElements: number;
    pageable: {
        offset: number;
        pageNumber: number;
        pageSize: number;
        paged: boolean;
        sort:
        {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        }
        unpaged: boolean;
    }
    size: number
    sort: {
        sorted: boolean;
        unsorted: boolean;
        empty: boolean;
    }
    totalElements: number;
    totalPages: number;
}