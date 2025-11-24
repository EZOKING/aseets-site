const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const dataDir = path.join(__dirname, 'data');
const messagesFile = path.join(dataDir, 'messages.json');

// Prépare le stockage des messages dès le démarrage.
function ensureStorage() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(messagesFile)) {
    fs.writeFileSync(messagesFile, '[]', 'utf8');
  }
}

async function readMessages() {
  const content = await fs.promises.readFile(messagesFile, 'utf8');
  return JSON.parse(content || '[]');
}

async function writeMessages(messages) {
  await fs.promises.writeFile(messagesFile, JSON.stringify(messages, null, 2), 'utf8');
}

ensureStorage();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/assets/css', express.static(path.join(__dirname, 'assets/css')));
app.use('/assets/js', express.static(path.join(__dirname, 'assets/js')));
app.use('/assets/img', express.static(path.join(__dirname, 'assets/img')));
app.use('/', express.static(__dirname));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/messages', async (req, res) => {
  try {
    const messages = await readMessages();
    res.json({ count: messages.length, messages });
  } catch (error) {
    console.error("Erreur lors de la lecture des messages :", error);
    res.status(500).json({ error: 'Impossible de récupérer les messages pour le moment.' });
  }
});

app.post('/api/contact', async (req, res) => {
  const name = (req.body.name || '').trim();
  const email = (req.body.email || '').trim();
  const message = (req.body.message || '').trim();

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Merci de remplir tous les champs.' });
  }

  const emailPattern = /.+@.+\..+/;
  if (!emailPattern.test(email)) {
    return res.status(400).json({ error: 'Adresse e-mail invalide.' });
  }

  const newEntry = {
    name,
    email,
    message,
    submittedAt: new Date().toISOString(),
  };

  try {
    const messages = await readMessages();
    messages.push(newEntry);
    await writeMessages(messages);
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du message :', error);
    return res.status(500).json({ error: "Impossible d'enregistrer votre message pour le moment." });
  }

  res.status(201).json({ message: 'Message bien reçu !', entry: newEntry });
});

app.listen(PORT, () => {
  console.log(`Serveur ASEETS en cours d'exécution sur le port ${PORT}`);
});
