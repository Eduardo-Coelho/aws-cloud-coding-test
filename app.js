process.env.PUBLISH_URL = 'http://localhost:3000';
const event = require('./event.json');
const { handler } = require('./dist/index');
handler(event);
