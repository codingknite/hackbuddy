const { nanoid } = require('nanoid');
const mongoose = require('mongoose');
const supertest = require('supertest');

const app = require('../../app');
const User = require('../user/user.model');
const Post = require('../userPost/post.model');
const Reply = require('../userReply/reply.model');
const testHelpers = require('../../utils/testSetup');
const { testReplies, testReply } = require('../../utils/testHelpers/replies');

const api = supertest(app);

beforeEach(async () => {
  const ID = await testHelpers.getUniqueID(Post);
  await Reply.deleteMany({});
  const newData = testReplies.map(
    (data) =>
      new Reply({
        uniqueID: nanoid(10),
        postID: ID,
        ...data,
      })
  );
  const promiseArray = newData.map((user) => user.save());
  await Promise.all(promiseArray);
});

test('it should get all replies', async () => {
  const ID = testHelpers.getUniqueID(Post);
  const response = await api
    .get(`/api/reply/${ID}`)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const allPostsInDb = await testHelpers.allDataInDb(Post);

  expect(response.body.status).toBe('success');
  expect(response.body.message).toBe('Replies Retrieved Successfully');
  expect(allPostsInDb).toHaveLength(2);
});

describe('when a reply is created', () => {
  test('auth token should be required', async () => {
    await api.post('/api/reply/').send(testReply).expect(401);
  });

  test('user must registered', async () => {
    const user = await User.find({ fullName: testReply.author });
    expect(user).toHaveLength(1);
    expect(user[0].fullName).toBe(testReply.author);
  });

  test('it should save reply', async () => {
    const ID = await testHelpers.getUniqueID(Post);
    const response = await api
      .post('/api/reply')
      .set('Authorization', `Bearer ${process.env.AUTH0_TEST_TOKEN}`)
      .send({
        postID: ID,
        ...testReply,
      })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const allPostsInDb = await testHelpers.allDataInDb(Reply);

    expect(allPostsInDb).toHaveLength(3);
    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Reply Created Successfully');
  });
});

describe('when reply is updated', () => {
  const update = {
    body: 'Lorem ipsum, dolor sit amet.',
  };

  test('auth token should be required', async () => {
    const ID = await testHelpers.getUniqueID(Reply);
    await api.patch(`/api/reply/${ID}`).send(update).expect(401);
  });

  test('it should update reply', async () => {
    const ID = await testHelpers.getUniqueID(Reply);
    const response = await api
      .patch(`/api/reply/${ID}`)
      .set('Authorization', `Bearer ${process.env.AUTH0_TEST_TOKEN}`)
      .send(update)
      .expect(201);

    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Reply Updated Successfully');
  });
});

describe('when reply is deleted', () => {
  test('auth token should be required', async () => {
    const ID = await testHelpers.getUniqueID(Reply);
    await api.delete(`/api/reply/${ID}`).expect(401);
  });

  test('it should delete reply', async () => {
    const ID = await testHelpers.getUniqueID(Reply);
    await api
      .delete(`/api/reply/${ID}`)
      .set('Authorization', `Bearer ${process.env.AUTH0_TEST_TOKEN}`)
      .expect(204);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
