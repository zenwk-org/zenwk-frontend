/**
 *  Script ambiente desarrollo para configurar https
 *  Para ambiente pruebas y producción es requerido configurar
 *  el conteneddor docker, se debe crear un nuevo servicio en docker-comopse.yml
 */
const { createServer } = require("https");
const { parse } = require("url");
const fs = require("fs");
const path = require("path");
const next = require("next");

const dev = true;
const app = next({ dev });
const handle = app.getRequestHandler();

// Rutas absolutas al certificado del backend
const keyPath = path.resolve(
    __dirname,
    "../infra-zenwk/keystore/dev/zenwk_dev.key"
);
const certPath = path.resolve(
    __dirname,
    "../infra-zenwk/keystore/dev/zenwk_dev.crt"
);

const httpsOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
};

app.prepare().then(() => {
    createServer(httpsOptions, (req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    }).listen(3001, (err) => {
        if (err) throw err;
        console.log("✅ Frontend corriendo en https://localhost:3001");
        console.log("🔐 Certificado cargado desde infra-zenwk");
    });
});
