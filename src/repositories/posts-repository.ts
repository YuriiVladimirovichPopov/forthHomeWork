import { postsCollection, blogsCollection } from '../db/db';
import { PostsMongoDbType, createPostDTOType } from '../types';
import { ObjectId, WithId } from 'mongodb';
import { PostsInputModel } from '../models/posts/postsInputModel';
import { PostsViewModel } from '../models/posts/postsViewModel';
import { blogsRepository } from './blogs-repository';
import { randomUUID } from 'crypto';

 
 export const postsRepository = {

    _postMapper(post: PostsMongoDbType): PostsViewModel {
    return {
        id: post._id.toString(),
        title: post.title, 
        shortDescription: post.shortDescription, 
        content: post.content, 
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt
    }
    },
    
    //10     READY
    async createdPostForSpecificBlog(model: PostsInputModel): 
    Promise<PostsViewModel | null> {
        const blog = await blogsRepository.findBlogById(model.blogId)
            if (!blog) {
                return null
            }
        const createPostForBlog: PostsViewModel = {
            id: randomUUID(),
            title: model.title,
            shortDescription: model.shortDescription,
            content: model.content,
            blogId: blog.id,
            blogName: blog.name,
            createdAt: new Date().toISOString()
        }
    await postsCollection.insertOne({
        ...createPostForBlog,               //tyt change this 2 lines
        _id: new ObjectId
    })
    return createPostForBlog
    },
 
    // async createPost(newPost:createPostDTOType): Promise<PostsMongoDbType | null> {       //TODO: create createPostDTOType
    //     return postsCollection.insertOne(newPost)
        
    // },

    //11       READY
    async updatePost(id: string, data: PostsInputModel): Promise<PostsViewModel | boolean> {
        const foundPostById = await postsCollection.updateOne({_id: new ObjectId(id)}, {$set: {... data}  })
            return foundPostById.matchedCount === 1
    },

    //12     READY
    async deletePost(id: string): Promise<PostsViewModel | boolean> {
        const foundPostById = await postsCollection.deleteOne({_id: new ObjectId(id)})
        
        return foundPostById.deletedCount === 1;
    },

    //13      READY
    async deleteAllPosts(): Promise<boolean> {
        try {
            const deletedPosts = await postsCollection.deleteMany({});
            return deletedPosts.acknowledged === true
        } catch(error) {
            return false;
        }
    }
 }

