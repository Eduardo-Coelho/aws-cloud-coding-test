const getResponse = (res) => {
  res.writeHead(200);
  res.write('Server OK');
  res.end();
};
exports.getResponse = getResponse;
