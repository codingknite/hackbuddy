const { nanoid } = require('nanoid');
const mongoose = require('mongoose');
const supertest = require('supertest');

const app = require('../../app');
const User = require('../user/user.model');
const testHelpers = require('../../utils/testSetup');
const Reply = require('../userReply/reply.model');
const SubReply = require('../userSubReply/subReply.model');
const {
  testSubReplies,
  testSubReply,
} = require('../../utils/testHelpers/subReplies');

const api = supertest(app);

beforeEach(async () => {
  const ID = await testHelpers.getUniqueID(Reply);
  await SubReply.deleteMany({});
  const newData = testSubReplies.map(
    (data) =>
      new SubReply({
        uniqueID: nanoid(10),
        replyID: ID,
        ...data,
      })
  );
  const promiseArray = newData.map((user) => user.save());
  await Promise.all(promiseArray);
});

test('it should get all subreplies', async () => {
  const ID = testHelpers.getUniqueID(Reply);
  const response = await api
    .get(`/api/subreply/${ID}`)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const allSubRepliesInDb = await testHelpers.allDataInDb(SubReply);

  expect(response.body.status).toBe('success');
  expect(response.body.message).toBe('SubReplies Retrieved Successfully');
  expect(allSubRepliesInDb).toHaveLength(2);
});

describe('when a subreply is created', () => {
  test('auth token should be required', async () => {
    await api.post('/api/reply/').send(testSubReply).expect(401);
  });

  test('user must registered', async () => {
    const user = await User.find({ fullName: testSubReply.author });
    expect(user).toHaveLength(1);
    expect(user[0].fullName).toBe(testSubReply.author);
  });

  test('it should save subreply', async () => {
    const ID = await testHelpers.getUniqueID(SubReply);
    const response = await api
      .post('/api/subreply')
      .set('Authorization', `Bearer ${process.env.AUTH0_TEST_TOKEN}`)
      .send({
        replyID: ID,
        ...testSubReply,
      })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const allSubRepliesInDb = await testHelpers.allDataInDb(SubReply);

    expect(allSubRepliesInDb).toHaveLength(3);
    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Reply Created Successfully');
  });
});

describe('when subreply is updated', () => {
  const update = {
    body: 'Lorem ipsum, dolor sit amet.',
  };

  test('auth token should be required', async () => {
    const ID = await testHelpers.getUniqueID(SubReply);
    await api.patch(`/api/reply/${ID}`).send(update).expect(401);
  });

  test('it should update subreply', async () => {
    const ID = await testHelpers.getUniqueID(SubReply);
    const response = await api
      .patch(`/api/subreply/${ID}`)
      .set('Authorization', `Bearer ${process.env.AUTH0_TEST_TOKEN}`)
      .send(update)
      .expect(201);

    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Reply Updated Successfully');
  });
});

describe('when subreply is deleted', () => {
  test('auth token should be required', async () => {
    const ID = await testHelpers.getUniqueID(SubReply);
    await api.delete(`/api/subreply/${ID}`).expect(401);
  });

  test('it should delete reply', async () => {
    const ID = await testHelpers.getUniqueID(SubReply);
    await api
      .delete(`/api/subreply/${ID}`)
      .set('Authorization', `Bearer ${process.env.AUTH0_TEST_TOKEN}`)
      .expect(204);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
