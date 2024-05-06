const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const { PORT, DATABASE, DATABASE_PASSWORD } = process.env;
const DB = DATABASE.replace('<password>', DATABASE_PASSWORD);

const Post = require('./models/posts');
const errorHandle = require('./errorHandle');
const successHandle = require('./successHandle');
const notFoundhandle = require('./notFoundhandle');
mongoose
  .connect(DB)
  .then(() => console.log('connected DB'))
  .catch(() => console.log('connect DB failed'));

const requestListener = async (req, res) => {
  let body = '';
  req.on('data', (chunk) => (body += chunk));
  const isPostUrl = req.url === '/posts';
  const startsWithPostUrl = req.url.startsWith('/posts/');
  const method = req.method;
  if (isPostUrl && method === 'GET') {
    try {
      const posts = await Post.find();
      successHandle(res, posts);
    } catch (error) {
      errorHandle(res);
    }
  } else if (isPostUrl && method === 'POST') {
    req.on('end', async () => {
      try {
        const { title, author, category, content, commentCount, likes, image } =
          JSON.parse(body);
        if (!title || !author || !content) {
          errorHandle(res);
        } else {
          const updatedData = await Post.create({
            title,
            author,
            category,
            content,
            commentCount,
            likes,
            image,
          });
          successHandle(res, updatedData);
        }
      } catch (error) {
        errorHandle(res);
      }
    });
  } else if (startsWithPostUrl && method === 'PATCH') {
    req.on('end', async () => {
      try {
        const id = req.url.split('/').pop();
        const data = JSON.parse(body);
        if (id && data) {
          const updatedData = await Post.findByIdAndUpdate(id, data, {
            new: true,
          });
          successHandle(res, updatedData);
        } else {
          errorHandle(res);
        }
      } catch (error) {
        errorHandle(res);
      }
    });
  } else if (startsWithPostUrl && method === 'DELETE') {
    try {
      const id = req.url.split('/').pop();
      const deleteData = await Post.findByIdAndDelete(id);
      console.log('deleteData', deleteData);
      if (deleteData) {
        successHandle(res, deleteData);
      } else {
        errorHandle(res);
      }
    } catch (error) {
      errorHandle(res);
    }
  } else if (isPostUrl && method === 'DELETE') {
    try {
      await Post.deleteMany({});
      console.log('result', result);
      successHandle(res, []);
    } catch (error) {
      errorHandle(res);
    }
  } else if (method === 'OPTIONS') {
    successHandle(res);
  } else {
    notFoundhandle(res);
  }
};

const server = http.createServer(requestListener);
server.listen(PORT || 8000);
