const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const crypto = require('crypto');
//

const verifyRate = require('./middleware/verifyRate');
const verifyName = require('./middleware/verifyName');
const verifyAge = require('./middleware/verifyAge');
const verifyTalkAndWatched = require('./middleware/verifyTalk');
const verifyToken = require('./middleware/verifyToken');

//
const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';
// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});
// req 1
app.get('/talker', async (req, res) => {
    const readTalkers = await fs.readFile('talker.json', 'utf8');
    const talkers = JSON.parse(readTalkers);
    if (!talkers || talkers.length === 0) {
     return res.status(200).json([]);
    }
    return res.status(200).json(talkers);
});
// requisito 2
app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const readTalkers = await fs.readFile('talker.json', 'utf8');
  const talkers = JSON.parse(readTalkers);
  const findTalker = talkers.find((t) => t.id === Number(id));
  if (!findTalker) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  return res.status(200).json(findTalker);
});
// requisito 3 e 4
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  }
  if (!regexEmail.test(email)) {
    return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  if (!password) {
    return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  }
  if (password.length < 6) {
    return res.status(400)
    .json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  const token = crypto.randomBytes(8).toString('hex');
  return res.status(200).json({ token });
});
// requisito 5
app.post('/talker', verifyToken,
verifyName, verifyAge,
verifyTalkAndWatched, verifyRate,
async (req, res) => {
  const readTalkers = await fs.readFile('talker.json', 'utf8');
  const talkers = JSON.parse(readTalkers);
  const newTalker = { ...req.body, id: talkers.length + 1 };
  talkers.push(newTalker);
  await fs.writeFile('talker.json', JSON.stringify(talkers, null, 2));
  return res.status(201).json(newTalker);
});
app.listen(PORT, () => {
  console.log('Online');
});
