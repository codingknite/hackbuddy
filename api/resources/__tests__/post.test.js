const { nanoid } = require('nanoid');
const mongoose = require('mongoose');
const supertest = require('supertest');

const app = require('../../app');
const User = require('../user/user.model');
const Post = require('../userPost/post.model');
const testHelpers = require('../../utils/testSetup');
const { testPosts, testPost } = require('../../utils/testHelpers/posts');

const api = supertest(app);

beforeEach(async () => {
  await Post.deleteMany({});
  const newData = testPosts.map(
    (data) =>
      new Post({
        uniqueID: nanoid(10),
        ...data,
      })
  );
  const promiseArray = newData.map((user) => user.save());
  await Promise.all(promiseArray);
});

test('it should get post', async () => {
  const ID = await testHelpers.getUniqueID(Post);

  const response = await api
    .get(`/api/post/${ID}`)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  expect(response.body.status).toBe('success');
  expect(response.body.message).toBe('Post Retrieved Successfully');
  expect(response.body.data[0].uniqueID).toBe(ID);
});

test('it should get all posts', async () => {
  const response = await api
    .get('/api/post')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const allPostsInDb = await testHelpers.allDataInDb(Post);

  expect(response.body.status).toBe('success');
  expect(response.body.message).toBe('Posts Retrieved Successfully');
  expect(allPostsInDb).toHaveLength(2);
});

describe('when a post is created', () => {
  test('auth token should be required', async () => {
    await api.post('/api/post').send(testPost).expect(401);
  });

  test('user must registered', async () => {
    const user = await User.find({ userName: testPost.userName });
    expect(user).toHaveLength(1);
    expect(user[0].userName).toBe(testPost.userName);
  });

  test('it should save post', async () => {
    const response = await api
      .post('/api/post')
      .set('Authorization', `Bearer ${process.env.AUTH0_TEST_TOKEN}`)
      .send(testPost)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const allPostsInDb = await testHelpers.allDataInDb(Post);

    expect(allPostsInDb).toHaveLength(3);
    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Post Created Successfully');
  });
});

describe('when post is updated', () => {
  const update = {
    body: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. omnis nulla obcaecati laboriosam. Officiis harum ullam alias voluptates!. Placeat, nemo. Nisi',
    comments: 9,
  };

  test('auth token should be required', async () => {
    const ID = await testHelpers.getUniqueID(Post);
    await api.patch(`/api/post/${ID}`).send(update).expect(401);
  });

  test('it should update post', async () => {
    const ID = await testHelpers.getUniqueID(Post);
    const response = await api
      .patch(`/api/post/${ID}`)
      .set('Authorization', `Bearer ${process.env.AUTH0_TEST_TOKEN}`)
      .send(update)
      .expect(201);

    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Post Updated Successfully');
  });
});

describe('when post is deleted', () => {
  test('auth token should be required', async () => {
    const ID = await testHelpers.getUniqueID(Post);
    await api.delete(`/api/post/${ID}`).expect(401);
  });

  test('it should delete post', async () => {
    const ID = await testHelpers.getUniqueID(Post);

    await api
      .delete(`/api/post/${ID}`)
      .set('Authorization', `Bearer ${process.env.AUTH0_TEST_TOKEN}`)
      .expect(204);
  });
});

describe('when posts are queried', () => {
  test('it should get user posts by email', async () => {
    const response = await api
      .get('/api/post/query?email=mark@robert.com')
      .expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Posts Retrieved Successfully');
    expect(response.body.data[0].userName).toBe('MarkRobertson');
  });

  test('it should get user posts by username', async () => {
    const response = await api
      .get('/api/post/query?userName=MarkRobertson')
      .expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Posts Retrieved Successfully');
    expect(response.body.data[0].author).toBe('Mark Robertson');
  });
});

afterAll(() => {
  mongoose.connection.close();
});
