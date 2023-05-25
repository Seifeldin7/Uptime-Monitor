const axios = require('axios');
const { checkService } = require('../../src/services');
const { Check, EmailNotification } = require('../../src/models');
jest.mock('axios');
const mockingoose = require('mockingoose').default;

describe('createCheck', () => {
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
