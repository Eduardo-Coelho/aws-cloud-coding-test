const unsupportedMethodResponse = (res) => {
  res.writeHead(400);
  res.write('Unsupported method');
};
exports.unsupportedMethodResponse = unsupportedMethodResponse;
