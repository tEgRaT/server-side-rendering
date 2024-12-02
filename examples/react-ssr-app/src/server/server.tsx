import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import HomePage from '../pages/HomePage';

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  const appString = renderToString(<HomePage />);

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
