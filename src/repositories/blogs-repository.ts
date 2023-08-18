import { ObjectId, WithId} from "mongodb";
import { blogsCollection } from "../db/db";
import { BlogInputModel } from "../models/blogs/blogsInputModel";
import { BlogsMongoDbType, RequestWithBody } from '../types';
import { BlogViewModel } from '../models/blogs/blogsViewModel';
import { PaginatedType } from "../routers/helpers/pagination";
import { PaginatedBlog } from '../models/blogs/paginatedQueryBlog';


export const blogsRepository = {

    _blogMapper(blog: BlogsMongoDbType): BlogViewModel {
        return {
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership
        }
    },

    //1      меняем(добавляем пагинацию)
    async findAllBlogs(pagination: PaginatedType): Promise<PaginatedBlog<BlogViewModel[]>> {
        const filter = {name: {$regex: pagination.searchNameTerm, $options: '1'}}
        const result: WithId<BlogsMongoDbType>[] =
        await blogsCollection.find(filter, {projection: {_id: 0}}) 
            
          .sort({[pagination.sortBy]: pagination.sortDirection})
          .skip(pagination.skip)
          .limit(pagination.pageSize)
          .toArray()
          
          const totalCount: number = await blogsCollection.countDocuments(filter)
          const pageCount: number = Math.ceil(totalCount / pagination.pageSize)
    
          const res: PaginatedBlog<BlogViewModel[]> = {
            pagesCount: pageCount,
            page: pagination.pageNumber,
            pageSize: pagination.pageSize,
            totalCount: totalCount,
            items: result.map(b => ({
                    id: b._id.toString(),
                    name: b.name,
                    description: b.description,
                    websiteUrl: b.websiteUrl,
                    createdAt: b.createdAt,
                    isMembership: b.isMembership
            }))
          }
          return res
    },

    //5        не меняем
    async findBlogById(id: string):Promise<BlogViewModel | null> {
        //if (!ObjectId.isValid(id)) {
        //    return null
        //}
        //const _id = new ObjectId(id)
        const blogById = await blogsCollection.findOne({id: id}, {projection:{_id:0}})
        if(!blogById) {
            return null
        }
        
        return this._blogMapper(blogById)
    },    
    //2
    async createBlog(newBlog: BlogsMongoDbType): Promise<BlogViewModel> { 
        
        await blogsCollection.insertOne({...newBlog})

        return this._blogMapper(newBlog)
    },

    //6        не меняем
    async updateBlog(id: string, data: BlogInputModel ): Promise<boolean> {
        if(!ObjectId.isValid(id)) {
            return false
        }
        const _id = new ObjectId(id)
        const foundBlogById = await blogsCollection.updateOne({_id}, {$set: {...data}})
        return foundBlogById.matchedCount === 1
    },
    
    //7         не меняем
    async deleteBlog(id: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const _id = new ObjectId(id)
        const foundBlogById = await blogsCollection.deleteOne({_id})
        
        return foundBlogById.deletedCount === 1
    }, 
    
    async deleteAllBlogs(): Promise<boolean> {
        try {
            const result = await blogsCollection.deleteMany({});
            return result.acknowledged === true
        } catch (error) {
            return false
        }
    }
}

function _blogMapper(): any {
    throw new Error("Function not implemented.");
}
