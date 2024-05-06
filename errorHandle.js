const { headers } = require('./constants');

const errorHandle = (res) => {
  res.writeHead(400, headers);
  res.write(
    JSON.stringify({
      status: 'false',
      message: 'data or id is incorrect',
    }),
  );
  res.end();
};

module.exports = errorHandle;
