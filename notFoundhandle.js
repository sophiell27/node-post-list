const { headers } = require('./constants');

const notFoundhandle = (res) => {
  res.writeHead(404, headers);
  res.write(
    JSON.stringify({
      status: 'false',
      message: '404 route not found',
    }),
  );
  res.end();
};

module.exports = notFoundhandle;
