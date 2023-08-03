import { ObjectId, WithId } from "mongodb";
import { blogsCollection } from "../db/db";
import { BlogInputModel } from "../models/blogs/blogsInputModel";
import { BlogsMongoDbType } from '../types';
import { BlogViewModel } from '../models/blogs/blogsViewModel';
import { randomUUID } from "crypto";



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
    
    async findAllBlogs(): Promise<BlogViewModel[]> {
        const allBlogs = await blogsCollection.find({}).toArray();
        return allBlogs.map((blog: BlogsMongoDbType) => this._blogMapper(blog))
    },

    async findBlogById(id: string):Promise<BlogViewModel | null> {
        if (!ObjectId.isValid(id)) {
            return null
        }
        const _id = new ObjectId(id)
        const blogById = await blogsCollection.findOne({_id: _id})
        if(!blogById) {
            return null
        }
        
        return this._blogMapper(blogById)
    
    },    
    
    async createBlog(data: BlogInputModel): Promise<BlogViewModel> { 
        const newBlog: BlogsMongoDbType = {
            _id: new ObjectId(),
            ...data,
            createdAt: new Date().toISOString(),
            isMembership: false,    
        }

        await blogsCollection.insertOne({...newBlog})

        return this._blogMapper(newBlog)
        
    },

    async updateBlog(id: string, data: BlogInputModel ): Promise<boolean> {
        if(!ObjectId.isValid(id)) {
            return false
        }
        const _id = new ObjectId(id)
        const foundBlogById = await blogsCollection.updateOne({_id}, {$set: {...data}})
        return foundBlogById.matchedCount === 1
    },
    
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