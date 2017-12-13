const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const request = require('request');
const btoa = require('btoa');
const serveStatic = require('serve-static');

const API = 'https://app.close.io/api/v1/';
const token = '8c94e40011d3a9d79cef879e07863727061d830f9a26edaba03dcb62';
const headers = {'Authorization': 'Basic ' + btoa(token + ':""')};

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(serveStatic(__dirname, {'index': ['public/index.html']}))

app.get('/api/saved_search', (req, res) => {
    request.get({url: API + 'saved_search', headers: headers}, (err, response, body) => {
        if (!err && response.statusCode == 200) { 
            res.send(body);
        }
    });
});

app.get('/api/lead', (req, res) => {
    var url = API + 'lead';
    var query = {query: req.query.query};
    request.get({url: url, qs: query, headers: headers}, (err, response, body) => {
        if (!err && response.statusCode == 200) {
            res.send(body);
        }
    });
});

app.get('/api/activity', (req, res) => {
    var url = API + 'activity';
    var query = {lead_id: req.query.lead_id};
    request.get({url: url, qs: query, headers: headers}, (err, response, body) => {
        if (!err && response.statusCode == 200) { 
            res.send(body);
        }
    });
});

const port = process.env.PORT || '3001';
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => console.log(`API running on localhost:${port}`));