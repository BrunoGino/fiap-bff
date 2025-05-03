require('dotenv').config();
require('newrelic');

const express = require('express');
const rateLimit = require('express-rate-limit'); // Importa o rate limit
const cors = require('cors');
const askRoute = require('./routes/ask');

const app = express();
app.use(express.json());

// Configura o CORS
const corsOptions = {
  origin: '*', // Permite todas as origens. Altere para um domínio específico, se necessário.
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
};
app.use(cors(corsOptions));

// Configura o rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20, // Limite de 20 requisições por IP
  message: { error: 'Muitas requisições. Tente novamente mais tarde.' },
});

// Aplica o rate limit globalmente
app.use(limiter);

// app.use('/ask', limiter, askRoute);
app.use('/ask', askRoute);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/teste', (req, res) => {
  res.status(200).json({ status: 'nova rota' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`BFF rodando na porta ${PORT}`));
