const _ = require('lodash');
const mongoose = require('mongoose');
const supertest = require('supertest');

const app = require('../../app');
const User = require('../user/user.model');
const testHelpers = require('../../utils/testSetup');
const { testUsers, testUser } = require('../../utils/testHelpers/users');

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
  const newData = testUsers.map((data) => new User(data));
  const promiseArray = newData.map((user) => user.save());
  await Promise.all(promiseArray);
});

describe('when user is created', () => {
  test('auth token should be required', async () => {
    await api.post('/api/user').send(testUser).expect(401);
  });

  test('it should save user', async () => {
    const response = await api
      .post('/api/user')
      .set('Authorization', `Bearer ${process.env.AUTH0_TEST_TOKEN}`)
      .send(testUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const allUsersInDb = await testHelpers.allDataInDb(User);

    expect(allUsersInDb).toHaveLength(3);
    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('User Created Successfully');
  });
});

describe('when user information is updated', () => {
  const updates = {
    fullName: 'Mark Robert',
    country: 'germany',
    website: 'https://mark.io',
    expertise: 'fullstack',
  };

  test('auth token should be required', async () => {
    await api.patch('/api/user/MarkRobertson').send(updates).expect(401);
  });

  test('it should update user information', async () => {
    const response = await api
      .patch('/api/user/MarkRobertson')
      .set('Authorization', `Bearer ${process.env.AUTH0_TEST_TOKEN}`)
      .send(updates)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const user = await User.find({ userName: 'MarkRobertson' });

    expect(user[0].fullName).toBe(updates.fullName);
    expect(user[0].country).toBe(updates.country);
    expect(user[0].website).toBe(updates.website);
    expect(user[0].expertise).toBe(updates.expertise);
    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('User Updated Successfully');
  });
});

describe('when user is deleted', () => {
  test('auth token should be required', async () => {
    await api.delete('/api/user/MarkRobertson').expect(401);
  });

  test('it should delete user', async () => {
    await api
      .delete('/api/user/MarkRobertson')
      .set('Authorization', `Bearer ${process.env.AUTH0_TEST_TOKEN}`)
      .expect(204);

    const allUsersInDb = await testHelpers.allDataInDb(User);
    expect(allUsersInDb).toHaveLength(1);
  });
});

describe('get user information', () => {
  test('it should get user by userName', async () => {
    const response = [];
    const user = await api
      .get('/api/user/jhex')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    response.push(user.body.data);

    expect(response).toHaveLength(1);
    expect(user.body.status).toBe('success');
    expect(user.body.message).toBe('User Retrieved Successfully');
  });

  test('user should not exist', async () => {
    await api.get('/api/users/codingknite').expect(404);
  });

  test('it should get user by email', async () => {
    const user = await api.get('/api/user/query?email=jhex@hex.io').expect(200);

    expect(user.body.status).toBe('success');
    expect(user.body.message).toBe('Query Successful');
  });
});

describe('when users are queried', () => {
  test('it should get user by tech', async () => {
    const user = await api.get('/api/user/query?tech=kotlin').expect(200);

    const expected = ['kotlin'];

    expect(user.body.status).toBe('success');
    expect(user.body.message).toBe('Query Successful');
    expect(user.body.data[0].tech).toEqual(expect.arrayContaining(expected));
  });

  test('it should get user by country', async () => {
    const user = await api
      .get('/api/user/query?country=united%20states')
      .expect(200);

    expect(user.body.status).toBe('success');
    expect(user.body.message).toBe('Query Successful');
    expect(user.body.data[0].country).toBe('united states');
  });

  test('it should get user by expertise', async () => {
    const user = await api.get('/api/user/query?expertise=android').expect(200);

    expect(user.body.status).toBe('success');
    expect(user.body.message).toBe('Query Successful');
    expect(user.body.data[0].expertise).toBe('android');
  });

  test('it should get user by language', async () => {
    const user = await api.get('/api/user/query?language=english').expect(200);

    expect(user.body.status).toBe('success');
    expect(user.body.message).toBe('Query Successful');
    expect(user.body.data[0].language).toBe('english');
  });

  test('it should get user by all queries', async () => {
    const user = await api
      .get(
        '/api/user/query?expertise=android&language=english&country=united%20states&tech=kotlin'
      )
      .expect(200);

    expect(user.body.status).toBe('success');
    expect(user.body.message).toBe('Query Successful');
    expect(user.body.data[0].language).toBe('english');
    expect(user.body.data[0].country).toBe('united states');
    expect(user.body.data[0].expertise).toBe('android');
    expect(user.body.data[0].tech).toEqual(expect.arrayContaining(['kotlin']));
  });
});

test('it should get all users', async () => {
  const response = await api.get('/api/user').expect(200);

  const responseSize = _.size(response.body.data);
  const allUsersInDb = await testHelpers.allDataInDb(User);

  expect(response.body.status).toBe('success');
  expect(response.body.message).toBe('Users Retrieved Successfully');
  expect(responseSize).toBe(2);
  expect(allUsersInDb).toHaveLength(responseSize);
});

afterAll(() => {
  mongoose.connection.close();
});
