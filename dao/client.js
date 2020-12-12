const { Pool } = require("pg");
const dbConfig = require("../config/db");
const pool = new Pool(dbConfig);

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
  });

const query = (query, params) => {
    return new Promise((resolve, reject) => {
        pool.query(query, params, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        });  
    })
}

const db = {
    getToken: (clientId) => {
        const q = "SELECT spotify_token FROM client WHERE client_id = $1";
        return query(q, [clientId]);
    },

    setTokens: (client, spotify_token, refresh_token) => {
        const q = 
            "INSERT INTO client(client_id, spotify_token, refresh_token) VALUES($1, $2, $3)";
        return query(q, [client, spotify_token, refresh_token]);
    },
};

module.exports = db;