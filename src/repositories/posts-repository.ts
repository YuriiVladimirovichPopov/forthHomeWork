import { postsCollection, blogsCollection } from '../db/db';
import { PostsMongoDbType } from '../types';
import { ObjectId, WithId } from 'mongodb';
import { PostsInputModel } from '../models/posts/postsInputModel';
import { PostsViewModel } from '../models/posts/postsViewModel';
import { blogsRepository } from './blogs-repository';

 
 
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
    async findAllPosts(): Promise<PostsViewModel[]> {
        const allPosts = await postsCollection.find({}).toArray()
        
        return allPosts.map((post: PostsMongoDbType) => this._postMapper(post))
    },

    async findPostById( id: string): Promise<PostsViewModel | null> {
        if (!ObjectId.isValid(id)) {
            return null
        }
        const _id = new ObjectId(id)
        const findPost = await postsCollection.findOne({_id: _id})
            if (!findPost) {
        return null
            }
            return this._postMapper(findPost)
    },
 
    async createPost( data: PostsInputModel): Promise<PostsViewModel | null> {
        const blog = await blogsRepository.findBlogById(data.blogId)
        if(!blog) return null

        const newPost: PostsMongoDbType = {
            _id: new ObjectId(data.blogId),
            ... data,
            blogName: blog.name,
            createdAt: new Date().toISOString(), 
        }
        await postsCollection.insertOne({...newPost}) 
            
            return this._postMapper(newPost)
    },
    async updatePost(id: string, data: PostsInputModel): Promise<PostsViewModel | boolean> {
        const foundPostById = await postsCollection.updateOne({_id: new ObjectId(id)}, {$set: {... data}  })
            return foundPostById.matchedCount === 1
    },
    async deletePost(id: string): Promise<PostsViewModel | boolean> {
        const foundPostById = await postsCollection.deleteOne({_id: new ObjectId(id)})
        
        return foundPostById.deletedCount === 1;
    },
    async deleteAllPosts(): Promise<boolean> {
        try {
            const deletedPosts = await postsCollection.deleteMany({});
            return deletedPosts.acknowledged === true
        } catch(error) {
            return false;
        }
    }
 }

