import  request  from 'supertest';
import { app } from '../src/settings';
import { BlogInputModel } from '../src/models/blogs/blogsInputModel';



export const createBlog = (data: BlogInputModel) => {
    return request(app)
            .post('/blogs')
            .auth('admin', 'qwerty')
            .send(data)
}