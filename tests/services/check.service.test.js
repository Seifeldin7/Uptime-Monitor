const axios = require('axios');
const { checkService } = require('../../src/services');
const { Check, EmailNotification } = require('../../src/models');
jest.mock('axios');
const mongoose = require('mongoose');

describe('createCheck', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/test-db', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('should create a new check and email notification', async () => {
    const checkData = {
      name: 'Test Check',
      url: 'http://example.com',
      protocol: 'http',
      interval: 5
    };
    const user = { id: 'test-user-id' };
    const emailNotification = new EmailNotification({
      type: 'EmailNotification'
    });
    await emailNotification.save();

    const result = await checkService.createCheck(checkData, user);

    expect(result.name).toEqual(checkData.name);
  });
});
