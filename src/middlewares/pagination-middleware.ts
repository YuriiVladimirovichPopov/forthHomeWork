import {NextFunction, Request, Response} from "express";


const defaultPageNumber = 1
const defaultPageSize = 10
const defaultSearchNameTerm = {}


export class PaginationMiddleware {

    use(req: Request, res: Response, next: NextFunction) {
        let pageNumber: any = req.query.PageNumber
        let pageSize: any = req.query.PageSize
        let searchNameTerm: any = req.query.SearchNameTerm
        if (!pageNumber) {
            pageNumber = defaultPageNumber
        } else {
            try {
                pageNumber = +pageNumber
                if (pageNumber <= 0) {
                    pageNumber = defaultPageNumber
                }
            } catch (e) {
                pageNumber = defaultPageNumber
            }
        }
        if (!pageSize) {
            pageSize = defaultPageSize
        } else {
            pageSize = +pageSize
            if (pageSize <= 0) {
                pageSize = defaultPageSize
            }
        }
        if (!searchNameTerm) {
            searchNameTerm = defaultSearchNameTerm
        } else {
            searchNameTerm = {name: {$regex: searchNameTerm}}
        }
        req.query.pageNumber = pageNumber
        req.query.pageSize = pageSize
        req.query.searchNameTerm = searchNameTerm
        next()
    }
}