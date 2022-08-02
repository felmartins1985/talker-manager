const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;

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
app.listen(PORT, () => {
  console.log('Online');
});
