const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb'
};
const mysql = require('mysql');
const connection = mysql.createConnection(config);

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send(`
        <h1>Full Cycle</h1>
        <form method="post" action="/add">
            <label for="name">Nome:</label>
            <input type="text" id="name" name="name" required>
            <button type="submit">Adicionar</button>
        </form>
        <br>
        <h2>Pessoas Adicionadas:</h2>
        <div id="peopleList"></div>
        <script>
            // Simples script para atualizar a lista de pessoas sem recarregar a página
            const updatePeopleList = () => {
                fetch('/people')
                    .then(response => response.text())
                    .then(data => document.getElementById('peopleList').innerHTML = data);
            };

            // Chama a função inicialmente e a cada vez que um registro é adicionado
            updatePeopleList();
        </script>
    `);
});

app.post('/add', (req, res) => {
    const name = req.body.name;

    if (!name) {
        return res.status(400).send('O campo "name" é obrigatório.');
    }

    const sql = `INSERT INTO people(name) VALUES (?)`;
    connection.query(sql, [name], (error, results) => {
        if (error) {
            return res.status(500).send('Erro ao inserir no banco de dados.');
        }
        const updatedPeopleList = results.map(person => person.name).join(', ');
        res.send(`Registro inserido com sucesso! <br> Pessoas Adicionadas: ${updatedPeopleList}`);
    });
});

app.get('/people', (req, res) => {
    const sql = `SELECT * FROM people`;
    connection.query(sql, (error, results) => {
        if (error) {
            return res.status(500).send('Erro ao buscar dados no banco de dados.');
        }
        const people = results.map(person => person.name).join(', ');
        res.send(`<p>${people}</p>`);
    });
});

app.listen(port, () => {
    console.log('Rodando na porta ' + port);
});
