const express = require('express');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const dataPath = path.join(__dirname, '..', 'data', 'portfolio.json');
const defaultPortfolio = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

//const databaseReady = true; 
const databaseReady = false;
const fallbackMessages = [];

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

async function loadPortfolio() {
  return defaultPortfolio;
}

app.get('/health', (_, response) => {
  response.json({
    status: 'ok',
    databaseReady
  });
});

app.get('/portfolio', async (_, response, next) => {
  try {
    const portfolio = await loadPortfolio();
    response.json(portfolio);
  } catch (error) {
    next(error);
  }
});

app.get('/projects', async (_, response, next) => {
  try {
    const portfolio = await loadPortfolio();
    response.json(portfolio.projects);
  } catch (error) {
    next(error);
  }
});

app.get('/skills', async (_, response, next) => {
  try {
    const portfolio = await loadPortfolio();
    response.json(portfolio.skills);
  } catch (error) {
    next(error);
  }
});

app.get('/experience', async (_, response, next) => {
  try {
    const portfolio = await loadPortfolio();
    response.json(portfolio.experience);
  } catch (error) {
    next(error);
  }
});

app.post('/contact', async (request, response, next) => {
  try {
    const { name, email, subject, message } = request.body;

    if (!name || !email || !subject || !message) {
      return response.status(400).json({
        message: 'Please fill out every field before submitting.'
      });
    }

    const payload = {
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim()
    };

    fallbackMessages.push({
      ...payload,
      createdAt: new Date().toISOString()
    });

    return response.status(201).json({
      message: 'Thanks for reaching out. I will get back to you soon.'
    });
  } catch (error) {
    next(error);
  }
});

app.get('/messages', async (_, response, next) => {
  try {
    return response.json(fallbackMessages);
  } catch (error) {
    next(error);
  }
});

app.get('/', (_, response) => {
  response.redirect('/about');
});

app.get('/about', (_, response) => {
  response.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('*', (_, response) => {
  response.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((error, _, response, __) => {
  console.error(error);
  response.status(500).json({
    message: 'Something went wrong on the server.'
  });
});

async function startServer() {
  app.listen(port, () => {
    console.log(`Portfolio server running at http://localhost:${port}`);
  });
}

startServer();
