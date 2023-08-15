import { ObjectId} from "mongodb";
import { blogsCollection } from "../db/db";
import { BlogInputModel } from "../models/blogs/blogsInputModel";
import { BlogsMongoDbType } from '../types';
import { BlogViewModel } from '../models/blogs/blogsViewModel';
import { PostsViewModel } from '../models/posts/postsViewModel';
import { PaginatedType, pagination } from "../models/blogs/pagination";
import { blogsRepository } from '../repositories/blogs-repository';
import { postsRepository } from '../repositories/posts-repository';


export const queryBlogRepozitory = {

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


async findAllPostsByBlogId(
        searchNameTerm: string,  
        pageNumber: number,
        pageSize: number,
        sortDirection: string,
        sortBy: string,
        blogById: string): Promise<PaginatedType | null> {
    await blogsRepository.findBlogById(blogById) 
        if(!blogById){
            return null;
        }
        const postsForSpecificBlogger = await postsRepository.findPostById(blogById)  
        return pagination(searchNameTerm, pageNumber, pageSize, sortDirection, sortBy, postsForSpecificBlogger)                                          //tyt dodelat
},

async createdPostForSpecificBlog(blogId: string): Promise<BlogViewModel> {
    await blogsCollection.created
}
}