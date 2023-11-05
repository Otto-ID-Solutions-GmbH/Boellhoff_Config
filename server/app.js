const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000; 


app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


app.post('/submit', (req, res) => {
    console.log(req.body)
    res.send(`Received: `);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
