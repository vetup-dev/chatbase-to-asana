const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const ASANA_TOKEN = '2/1142975042859069/1209987490122998:8054b5356ced9df07e039fbed9a121f5';
const PROJECT_ID = '1199649171692106';

app.post('/webhook', async (req, res) => {
  const pergunta = req.body?.message || JSON.stringify(req.body) || 'Mensagem não recebida corretamente';
  console.log("📩 Corpo recebido:", req.body);

  try {
    await axios.post('https://app.asana.com/api/1.0/tasks', {
      data: {
        name: `Nova interação do Chatbase`,
        notes: `Usuário escreveu: ${pergunta}`,
        projects: [PROJECT_ID],
        assignee: 'leandro@vetup.com.br',
        due_on: new Date().toISOString().split('T')[0] // Data de hoje no formato YYYY-MM-DD
      }
    }, {
      headers: {
        'Authorization': `Bearer ${ASANA_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    res.status(200).json({ message: '✅ Tarefa criada no Asana!' });
  } catch (error) {
    console.error('❌ Erro:', error.response?.data || error.message);
    res.status(500).send('Erro ao criar tarefa no Asana');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
