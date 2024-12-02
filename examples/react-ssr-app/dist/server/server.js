"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const react_1 = __importDefault(require("react"));
const server_1 = require("react-dom/server");
const HomePage_1 = __importDefault(require("../pages/HomePage"));
const app = (0, express_1.default)();
const PORT = 3000;
app.get('/', (req, res) => {
    const appString = (0, server_1.renderToString)(react_1.default.createElement(HomePage_1.default, null));
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>React SSR App</title>
        </head>
        <body>
            <div id="root">${appString}</div>
        </body>
    </html>
  `);
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
