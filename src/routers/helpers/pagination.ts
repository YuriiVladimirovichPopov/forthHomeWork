


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
        searchNameTerm: '',
        pageNumber: 1, 
        pageSize: 10, 
        sortDirection: 'desc',
        sortBy: 'createdAt',
        skip: 0
    }
        if(query.sortBy){
            defaultValues.sortBy = query.sortBy
        }
    
        if(query.sortDirection && query.sortDirection === 'asc') { 
             defaultValues.sortDirection = query.sortDirection 
        }
    
        if(query.pageNumber  && !isNaN(parseInt(query.pageNumber, 10)) && parseInt(query.pageNumber, 10) > 0) {
             defaultValues.pageNumber = parseInt(query.pageNumber, 10)
        } 
    
        if(query.pageSize  && !isNaN(parseInt(query.pageSize, 10)) && parseInt(query.pageSize, 10) > 0) {
            defaultValues.pageSize = parseInt(query.pageSize, 10)
       } 
           
        if(query.searchNameTerm) {
            defaultValues.searchNameTerm = query.searchNameTerm
        }
    defaultValues.skip = (defaultValues.pageNumber - 1) * defaultValues.pageSize

    return defaultValues




}
    
    
    