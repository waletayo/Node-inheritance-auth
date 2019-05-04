'use strict';
require('dotenv').config();
const PORT = process.env.PORT || 4000;
module.exports = {
    app: {
        name: "coin shop",
        superSecret: "ipm-power",
        baseUrl: `http://localhost:${PORT}`,
        port: PORT,
        expiresIn: 86400

    },

    api: {
        prefix: '^/api/v[1-9]',
        version: [1],
        lang: 'en',
        pagination: {
            itemsPerPage: 10
        },
    },
    database: {
        url: process.env.DB_URL,
    }
};
