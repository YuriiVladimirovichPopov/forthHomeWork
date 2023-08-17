


export type PaginatedType = {
    pageNumber: number,
    pageSize: number,
    sortDirection: 'asc' | 'desc',
    sortBy: string,
    skip: number,
    searchNameTerm?: string
}

export const getPaginationFromQuery = (query: any): PaginatedType => {

    const defaultValues: PaginatedType = {
        pageNumber: 1, 
        pageSize: 10, 
        sortDirection: 'asc',
        sortBy: 'createdAt',
        skip: 0
    }
        if(query.sortBy){
            defaultValues.sortBy = query.sortBy
        }
    
        if(query.sortDirection && query.sortDirection === 'asc') { 
             defaultValues.sortDirection = query.sortDirection 
        }
    
        if(query.pageNumber  && query.pageNumber > 0) {
             defaultValues.pageNumber = +query.pageNumber 
        } 
    
        if (query.pageSize && query.pageSize > 0) {
             defaultValues.pageSize = +query.pageSize 
        }
            
    defaultValues.skip = (defaultValues.pageNumber - 1) * defaultValues.pageSize

    return defaultValues




}
    
    
    