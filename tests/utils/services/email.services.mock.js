const emailService = {};

emailService.sendMail = jest.fn().mockImplementation((Options) => {
  return new Promise((resolve, reject) => {
    resolve(Options);
  })
});


module.exports = emailService;