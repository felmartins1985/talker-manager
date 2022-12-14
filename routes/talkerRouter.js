const express = require('express');
const fs = require('fs').promises;

const router = express.Router();
const verifyRate = require('../middleware/verifyRate');
const verifyName = require('../middleware/verifyName');
const verifyAge = require('../middleware/verifyAge');
const verifyTalkAndWatched = require('../middleware/verifyTalkAndWatched');
const verifyToken = require('../middleware/verifyToken');

const FILE_TALKER = 'talker.json';
//
// req 1
router.get('/', async (req, res) => {
  const readTalkers = await fs.readFile(FILE_TALKER, 'utf8');
  const talkers = JSON.parse(readTalkers);
  if (!talkers || talkers.length === 0) {
   return res.status(200).json([]);
  }
  return res.status(200).json(talkers);
});
//
// requisito 8
router.get('/search', verifyToken, async (req, res) => {
const { q } = req.query;
const readTalkers = await fs.readFile(FILE_TALKER, 'utf8');
const talkers = JSON.parse(readTalkers);
const filterTalker = talkers.filter((t) => t.name.includes(q));
if (filterTalker === undefined || filterTalker === '') {
  return res.status(200).json(talkers);
}
if (!filterTalker) {
  return res.status(200).json([]);
}
return res.status(200).json(filterTalker);
});

// requisito 2
router.get('/:id', async (req, res) => {
const { id } = req.params;
const readTalkers = await fs.readFile(FILE_TALKER, 'utf8');
const talkers = JSON.parse(readTalkers);
const findTalker = talkers.find((t) => t.id === Number(id));
if (!findTalker) {
  return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
}
return res.status(200).json(findTalker);
});
//------
// requisito 5
router.post('/', verifyToken,
verifyName, verifyAge,
verifyTalkAndWatched, verifyRate,
async (req, res) => {
  const readTalkers = await fs.readFile(FILE_TALKER, 'utf8');
  const talkers = JSON.parse(readTalkers);
  const newTalker = { ...req.body, id: talkers.length + 1 };
  talkers.push(newTalker);
  await fs.writeFile('talker.json', JSON.stringify(talkers, null, 2));
  return res.status(201).json(newTalker);
});
// req 6
router.put('/:id', verifyToken,
verifyName, verifyAge,
verifyTalkAndWatched, verifyRate, async (req, res) => {
  const { id } = req.params;
  const readTalkers = await fs.readFile(FILE_TALKER, 'utf8');
  const talkers = JSON.parse(readTalkers);
  const findTalker = talkers.findIndex((t) => t.id === Number(id));
  talkers[findTalker] = { ...req.body, id: Number(id) };
  await fs.writeFile('talker.json', JSON.stringify(talkers, null, 2));
  return res.status(200).json(talkers[findTalker]);
});
// req 7
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const readTalkers = await fs.readFile(FILE_TALKER, 'utf8');
  const talkers = JSON.parse(readTalkers);
 const filterTalker = talkers.filter((t) => t.id !== Number(id));
  // const findTalker = talkers.findIndex((t) => t.id === Number(id));
  // if (findTalker === -1) return res.status(404).json({ message: 'Not found!' });
  // talkers.splice(findTalker, 1);
  await fs.writeFile('talker.json', JSON.stringify(filterTalker, null, 2));
  return res.status(204).end();
});
//
module.exports = router;
