const { validate } = require('jsonschema');
const schema = require('./schema.json');

const clientError = (res, errors) => {
  res.writeHead(400);
  res.write(
    JSON.stringify({
      status: 'Failure',
      message: 'Invalid request body',
      errors,
    })
  );
  res.end();
};

const postResponse = (req, res) => {
  const chunks = [];
  req.on('data', (data) => chunks.push(data));
  req.on('end', () => {
    const body = Buffer.concat(chunks).toString('utf-8');
    try {
      const json = JSON.parse(body);
      const validationResult = validate(json, schema);

      if (validationResult.valid) {
        res.writeHead(200);
        res.write(JSON.stringify({ status: 'Success' }));
        res.end();
        return;
      }
      return clientError(
        res,
        validationResult.errors.map((e) => [e.path, e.message].join(' '))
      );
    } catch (error) {
      return clientError(res, [error.message]);
    }
  });
};
exports.postResponse = postResponse;
