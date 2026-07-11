app.get('/run', (req, res) => {
const handlers = {
  ping: () => 'ok',
  status: () => 'running',
};

const action = typeof req.query.action === 'string' ? req.query.action : '';
const handler = handlers[action];

if (!handler) {
  res.status(400).send('invalid action');
  return;
}

res.send(handler());
});