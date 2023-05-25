const { checkController } = require('../../src/controllers');
const { checkService } = require('../../src/services');
const requestMocks = require('../utils/request.mock');
const mockingoose = require('mockingoose');
const { Check } = require('../../src/models');
const { scheduleCheck } = require('../../src/jobs/check.cron');

jest.mock('../../src/jobs/check.cron', () => {
  return {
    scheduleCheck: jest.fn()
  };
});

describe('createCheck', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      params: {},
      query: {},
      body: {
        url: 'http://example.com',
        interval: 60,
        tags: ['tag1', 'tag2']
      },
      user: {
        id: 'user123'
      }
    };

    res = requestMocks.mockResponse();
    next = jest.fn();
  });

  it('should create a new check', async () => {
    // Arrange
    const check = {
      _id: 'check123',
      url: 'http://example.com',
      interval: 60,
      tags: ['tag1', 'tag2'],
      user: 'user123'
    };

    const report = {
      check: check._id
    };

    const expectedResponseBody = expect.objectContaining(check);

    mockingoose.Check.toReturn(check, 'save');
    mockingoose.Report.toReturn(report, 'save');

    // Act
    await checkController.createCheck(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(201);
    const response = res.json.mock.calls[0][0];
    expect(response.url).toEqual(check.url);
    expect(response.interval).toEqual(check.interval);
    response.tags.forEach((tag, index) => {
      expect(tag).toEqual(check.tags[index]);
    });
  });
});

describe('updateCheck', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      params: {
        id: 'check123'
      },
      body: {
        url: 'http://example.com',
        interval: 60,
        tags: ['tag1', 'tag2']
      },
      user: {
        id: 'user123'
      }
    };

    res = requestMocks.mockResponse();
    next = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('when check exists', () => {
    let existingCheck;
    let updatedCheck;

    beforeEach(() => {
      existingCheck = {
        _id: 'check123',
        url: 'http://oldurl.com',
        interval: 30,
        tags: ['oldtag'],
        user: 'user123',
        job: {
          stop: jest.fn()
        }
      };

      updatedCheck = {
        _id: 'check123',
        url: 'http://example.com',
        interval: 60,
        tags: ['tag1', 'tag2'],
        user: 'user123',
        job: {
          start: jest.fn(),
          stop: jest.fn()
        }
      };

      checkService.getCheckById = jest.fn().mockResolvedValue(existingCheck);
      checkService.updateCheck = jest.fn().mockResolvedValue(updatedCheck);
    });

    it('should stop the existing cron job', async () => {
      await checkController.updateCheck(req, res, next);

      expect(existingCheck.job.stop).toHaveBeenCalled();
    });

    it('should update the check and schedule a new cron job', async () => {
      await checkController.updateCheck(req, res, next);

      expect(scheduleCheck).toHaveBeenCalledWith(updatedCheck);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedCheck);
    });
  });
});
