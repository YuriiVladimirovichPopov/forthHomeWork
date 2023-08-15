import { BlogViewModel } from "./blogsViewModel"
import { PostsViewModel } from "../posts/postsViewModel"


export type PaginatedType = {
    searchNameTerm: string,
    pageNumber: number,
    pageSize: number,
    sortDirection: 'asc' | 'desc',
    sortBy: string
    skip: number
}

export const getPaginationFromQuery = (
    searchNameTerm: '',
    pageNumber: 1, 
    pageSize: 10, 
    sortDirection: 'asc',
    sortBy: 'createdAt',
    skip: 0
    ): PaginatedType => {
        return {
            searchNameTerm,
            pageNumber,
            pageSize,
            sortDirection,
            sortBy,
            skip
        }
    }