const path = require('path');
const express = require('express');
const axios = require('axios');
const querystring = require('querystring');

const CLIENT_ID = '<client id>';
const CLIENT_SECRET = '<client secret>';

const BASE64_AUTH = Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64');

let accessToken = null;
let refreshToken = null;

const app = express();

app.get('/bundle.js', function(req, res) {
    res.sendFile(path.join(__dirname, 'bundle.js'));
});

app.get('/', function(req, res) {
    if (req.query.code && accessToken === null) {
        console.log(req.query.code);

        axios.post('https://api.fitbit.com/oauth2/token', 
            querystring.stringify({
                'code': req.query.code,
                'grant_type': 'authorization_code',
            }), {
                headers: {
                    'Authorization': 'Basic ' + BASE64_AUTH,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        ).then(function(response) {
            accessToken = response.data.access_token;
            refreshToken = response.data.refresh_token;
            res.sendFile(path.join(__dirname, 'index.html'));
        }).catch(function(error) {
            res.send('Authorization error.');
        });
    } else {
        res.sendFile(path.join(__dirname, 'index.html'));
    }
});

app.get('/fitbit-data', function(req, res) {
    if (accessToken === null) {
        res.status(500).send('No FitBit access token.');
    } else {
        axios.get('https://api.fitbit.com/1/user/-/activities/heart/date/today/1d/1sec/time/00:00/00:01.json',
            {
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                }
            }
        ).then(function(response) {
            res.send(response.data);
        }).catch(function(error) {
            res.send(error);
        })
    }
})


app.listen(8000, function() {
    console.log('Server running on port 8000...');
    console.log('Press Ctrl+C to quit.');
});