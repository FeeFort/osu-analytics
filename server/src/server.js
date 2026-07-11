app.get('/run', (req, res) => {
  eval(req.query.code); // code injection
});