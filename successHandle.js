const { headers } = require('./constants');

const successHandle = (res, data) => {
  res.writeHead(200, headers);
  {
    data &&
      res.write(
        JSON.stringify({
          status: 'success',
          data,
        }),
      );
  }
  res.end();
};

module.exports = successHandle;
