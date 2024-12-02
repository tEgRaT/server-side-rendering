# Introducton to Server-Side Rendering (SSR) with React

## Fundamentals of Server-Side Rendering with React

Example of a basic SSR setup using Node.js and Express.js:

```javascript
// server.js
import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from './App';

const server = express();

server.get('/', (req, res) => {
  const html = ReactDOMServer.renderToString(<App />);

  res.send(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>SSR with React</title>
            </head>
            <body>
                <div id="root">${html}</div>
                <script src="/bundle.js"></script>
            </body>
        </html>
    `);
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
```

### Client-Side Hydration

Once the HTML is served, React can take over the client-side by "hydrating" the already rendered markup. This is done using `ReactDOM.hydrate()`.

#### Example of Hydration:

To ensure React takes control of the server-rendered HTML, developers can use the following code in their client-side entry point:

```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.hydrate(<App />, document.getElementById('root'));
```

## Setting up Development Environment for React SSR

### Step 1: Setting up the Project Folder

```bash
mkdir react-ssr-app
cd react-ssr-app
pnpm init
```

### Step 2: Installing Dependencies

```bash
pnpm add react react-dom express
pnpm typescript --save-dev
pnpm add @types/react @types/react-dom @types/express --save-dev
```

Create a `tsconfig.json` file in the root of the project to configure TypeScript:

```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "jsx": "react",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.spec.ts"]
}
```

### Step 3: Creating the Application Structure

```bash
mkdir src
mkdir src/components
mkdir src/pages
mkdir src/server
```

#### Creating a Sample Component

```typescript
// src/components/HelloWorld.tsx
import React from 'react';

const HelloWorld: React.FC = () => {
  return <h1>Hello, world!</h1>;
};

export default HelloWorld;
```

#### Creating a Sample Page

```tsx
// src/pages/HomePage.tsx
import React from 'react';
import HelloWorld from '../components/HelloWorld';

const HomePage: React.FC = () => {
  return (
    <div>
      <HelloWorld />
    </div>
  );
};

export default HomePage;
```

#### Setting up the Server

```tsx
// src/server/server.tsx
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
```

### Step 4: Running the Application

```json
// package.json
...
  "scripts": {
    "build": "tsc",
    "start": "node dist/server/server.js",
    "dev": "nodemon src/server/server.js"
  },
...
```

```bash
pnpm run build
pnpm start
```

### Bundle the Application

Install **webpack** for bundling:

```bash
pnpm add webpack webpack-cli ts-loader @types/webpack --save-dev
```

Create a `webpack.config.js` file:

```javascript
const path = require('path');

module.exports = {
  entry: './src/index.tsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};
```

### Update Package Scripts

```json
// package.json
...
  "scripts": {
    "build": "tsc && webpack",
    "start": "node dist/server/server.js",
    "dev": "nodemon src/server/server.js"
  },
...
```

### Step 5: Running the Application with Bundled JavaScript

```bash
pnpm run build
pnpm start
```

### Step 6: Creating a Client-Side App

Create a new directory for the client-side app:

```bash
mkdir src/client
```

#### Setting up the Client App

````tsx
// src/client/client.tsx

## Understanding SSR Concepts

### Hydration in SSR

Hydration is an essential concept in SSR. After the initial HTML is delivered to the client, the JavaScript bundles are loaded to enable interactivity. Hydration is the process where the client-side JavaScript takes over the server-generated HTML. It essentially "wakes up" the static content so users can interact with it.

#### The Hydraton Process

1. **Initial Request**: The client makes a request to the server for a specific page.
1. **HTML Response**: The server processes the request and sends back a fully rendered HTML page.
1. **JavaScript Loading**: The client then downloads the JavaScript bundles necessary for interactivity.
1. **Hydration**: The client-side JavaScript attaches event listeners and initializes components on the server-rendered HTML, making it interactive.

#### Example of Hydration in TypeScript

```tsx
import React from 'react';
import { hydrate } from 'react-dom';
import App from './App';

hydrate(<App />, document.getElementById('root'));
````

In this example, the `hydrate` function from React is used to attach event listeners to the existing HTML markup. This process ensures that the application can respond to user interactions without requiring another full render from scratch.

### Client-Side Rendering (CSR) vs. Server-Side Rendering (SSR)

#### Client-Side Rendering (CSR)

- **Process**: The browser requests a minimal HTML page, then fetches JavaScript files and renders the content in the browser.
- **Initial Load**: The initial load may be slower since the browser must download JavaScript files before rendering content.
- **User Interaction**: Once the application is loaded, interactions are generally faster, as they do not require additional requests to the server for rendering.

#### Server-Side Rendering (SSR)

- **Process**: The server generates and serves fully rendered HTML pages in response to user requests.
- **Initial Load**: The initial load is typically faster, and the user sees content immediately.
- **User Interaction**: Subsequent interactions may require additional round trips to the server, especially for dynamic content.

### Choosing between CSR and SSR

1. **SEO Requirements**: If SEO is a priority, SSR is often more beneficial since search engines can index fully rendered pages more effectively.
1. **Performance Goals**: For applications requiring fast initial load times, SSR may be the right choice. However, if the application is highly interactive and dynamic, CSR might be more appropriate.
1. **User Experience**: Consider the target audience. If the users may have varying internet speeds or devices, SSR can help deliver content more reliably.

## Fetching Data for SSR

### Example using Axios in TypeScript

```tsx
import express from 'express';
import axios from 'axios';
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

const app = express();

app.get('/', async (req, res) => {
  try {
    const response = await axios.get('https://api.example.com/data');
    const data = response.data;

    // Render the application with the fetched data
    const html = renderToString(<App initalData={data} />);

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>SSR Example</title>
        </head>
        <body>
          <div id="root">${html}</div>
          <script>window.__INITIAL_DATA__ = ${JSON.stringify(data)}</script>
          <script src="/bundle.js"></script>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
```

### Data Pre-fetching

Data pre-fetching involves fetching data in advance, typically during the build process or when the server is initialized. This strategy is suitable for static data that does not change frequently.

```tsx
import express from 'express';
import axios from 'axios';
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

const app = express();

// Pre-fetching data at server start
let preFetchedData: any;

const fetchData = async () => {
  try {
    const response = await axios.get('https://api.example.com/data');
    preFetchedData = response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

fetchData();

app.get('/', (req, res) => {
  // Render the application with pre-fetched data
  const html = renderToString(<App initalData={preFetchedData} />);

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>SSR with Pre-fetching Example</title>
      </head>
      <body>
        <div id="root">${html}</div>
        <script>window.__INITIAL_DATA__ = ${JSON.stringify(preFetchedData)}</script>
        <script src="/bundle.js"></script>
      </body>
    </html>
  `);
};

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
```

### Using Context API for Data Management

```tsx
import React, { createContext, useContext } from 'react';
import express from 'express';
import axios from 'axios';
import { renderToString } from 'react-dom/server';
import App from './App';

const DataContext = createContext<any>(null);

const app = express();

app.get('/', async (req, res) => {
  try {
    const response = await axios.get('https://api.example.com/data');
    const data = response.data;

    const html = renderToString(
      <DataContext.Provider value={data}>
        <App />
      </DataContext.Provider>
    );

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>SSR with Context API Example</title>
        </head>
        <body>
          <div id="app">${html}</div>
          <script>windows.__INITIAL_DATA__ = ${JSON.stringify(data)}</script>
          <script src="/bundle.js"></script>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});

export const useData = () => {
  return useContext(DataContext);
};

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
};
```

#### Explanation:

- The example uses the Context API to create a `DataContext` that holds the fetched data.
- The data is provided to the `App` component through the `DataContext.Provider`, which can access it via the `useData` hook.

#### Advantages:

- Simplifies data management across component.
- Reduces prop drilling.

#### Disadvantages:

- Adds complexity to the architecture.
- Requires carefull handling to avoid unnecessary renders.

### Combined Strategies

```tsx
import express from 'express';
import axios from 'axios';
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

const app = express();
let preFetchedData: any;

const fetchData = () => {
  const response = axios.get('https://api.example.com/data');
  preFetchedData = response.data;
};

fetchData();

app.get('/dynamic', async (req, res) => {
  try {
    const response = await axios.get('https://api.example.com/dynamic-data');
    const dynamicData = response.data;

    const html = renderToString(<App initialData={{ staticData: preFetchedData, dynamicData }} />);

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>SSR with Combined Strategies</title>
        </head>
        <body>
          <div id="app">${html}</div>
          <script>
            window.__INITIAL_DATA__ = ${JSON.stringify({ staticData: preFetchedData, dynamicData })}
          </script>
          <script src="/bundle.js"></script>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
};

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
```

## Building Dynamic Routes with SSR

```tsx
import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

const app = express();

const PORT = process.env.PORT || 3000;

// Sample React component
const App = ({ message }: { message: string }) => (
  return <div>Hello, {message}</div>;
};

// Route handling
app.get('/:dynamicRoute', (req, res) => {
  const message = req.params.dynamicRoute;
  const html = ReactDOMServer.renderToString(<App message={message} />);

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Dynamic Route SSR</title>
      </head>
      <body>
        <div id="root">${html}</div>
      </body>
    </html>
  `);
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost/${PORT}`);
});
```

```tsx
app.get('/user/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const userData = await fetch(
      `https://jsonplaceholder.typicode.com/users/${userId}`
    );
    const userJson = userData.json();

    const html = ReactDOMServer.renderToString(<App message={userJson.name} />);

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>User Profile</title>
        </head>
        <body>
          <div id="root">${html}</div>
        </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send('Error fetching user data');
  }
});
```

## Handling State Management in SSR

### Redux

#### Setting up Redux in an SSR Application

```bash
npm install redux react-redux @reduxjs/toolkit
```

#### Create a Redux Store

```javascript
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';

const store = configureStore({
  reducer: rootReducer,
});

export default store;
```

#### Integrating Redux with SSR

When rendering the application on the server, you need to provide the initial state to the client. An example of a server-side function might look like this:

```tsx
import express from 'express';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import App from './App';
import store from './store';

const app = express();

app.get('*', (req, res) => {
  const preloadedState = {}; // fetch or compute initial state
  const store = configureStore({ preloadedState });

  const jsx = (
    <Provider store={store}>
      <App />
    </Provider>
  );

  const html = renderToString(jsx);

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>SSR with Redux</title>
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(store.getState())}
        </script>
        <script src="/bundle.js"></script>
      </body>
    </html>
  `);
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
```

#### Hydrating the Store on the Client

On the client side, the application can use the state provided by the server.

```tsx
import { hydrate, render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import configureStore from './store';

const preloadedState = window.__PRELOADED_STATE__;
const store = configureStore({ preloadedState });

const rootElement = document.getElementById('root');

// Hydration
hydrate(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
);
```

### React Context API

The React Context API is another way to manage state in a React application without the need for external libraries. It allows for passing data through the component tree without having to pass props down manually at every level.

#### Creating a Context

```tsx
import React, { createContext, useContext, useReducer } from 'react';

interface State {
  count: number;
}

const initialState: State = { count: 0 };
const AppContext = createContext<
  { state: State; dispatch: React.Dispatch<any> } | undefined
>(undefined);

const appReducer = (state: State; action: { type: string}) => {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + 1 };
    default:
      return state;
  }
};

export const AppProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return <AppContext.Provider value={{ state, dispatch}}>{children}</AppContext.Provider>
};

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }

  return context;
};
```

#### Integrating Context with SSR

Similar to Redux, the context must be set up on the server with initial state.

```tsx
import express from 'express';
import { renderToString } from 'react-dom/server';
import App from './App';
import { AppProvider } from './AppContext';

const app = express();

app.get('*', (req, res) => {
  const initialState = { count: 0 }; // Set initial state here

  const jsx = (
    <AppProvider initialState={initialState}>
      <App />
    </AppProvider>
  );

  const html = renderToString(jsx);

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>SSR with React Context</title>
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
        </script>
        <script src="/bundle.js"></script>
      </body>
    </html>
  `);
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
```

#### Hydrating Context on the Client

On the client side, the application can use the initial state provided by the server.

```tsx
import { hydrate } from 'react-dom';
import App from './App';
import { AppProvider } from './AppContext';

const initialState = window.__INITIAL_STATE__;

hydrate(
  <AppProvider initialState={initialState}>
    <App />
  </AppProvider>,
  document.getElementById('root')
);
```

## Implementing Authentication in SSR

### Authentication Strategies

#### Session-Based Authentication

Session-based authentication involves creating a session on the server when a user logs in. The server stores session data typically in memory or a database and sends a session ID to the client.

##### Creating a Session on Login

In the server-side code, when a user logs in successfully, a session can be created as follows:

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSession } from 'next-iron-session';

export default withIronSession(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { username, password } = req.body;

    // Simulate user authentication
    if (username === 'name' && password === 'pass') {
      req.session.set('user', { username });
      await req.session.save();
      res.send({ ok: true });
    } else {
      res.status(401).send({ ok: false });
    }
  },
  {
    cookieName: 'session_cookie',
    password: process.env.SESSION_SECRET,
  }
);
```

##### Accessing Session Data

In protected pages, you can access the session data:

```tsx
import { GetServerSideProps } from 'next';
import { withIronSession } from 'next-iron-session';

export const getServerSideProps: GetServerSideProps = withIronSession(
  async ({ req }) => {
    const user = req.session.get('user');

    if (!user) {
      return { redirect: { destination: '/login', permanent: false } };
    }

    return { props: { user } };
  },
  {
    cookieName: 'session_cookie',
    password: process.env.SESSION_SECRET,
  }
);

const UserProfile = ({ user }) => {
  return <div>Welcome, {user.name}!</div>;
};

export default UserProfile;
```

#### Token-Based Authentication (JWT)

Another popular strategy is token-based authentication using JSON Web Tokens (JWT). Upon successful login, the server issues a JWT, which the client stores and sends with every request.

##### Generating a JWT on login

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { username, password } = req.body;

  // Simulate user authentication
  if (username === 'name' && password === 'pass') {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.send({ ok: true, token });
  } else {
    res.status(401).send({ ok: false });
  }
};
```

##### Securing Routes with JWT

To protect routes, the server needs to verify the token:

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).send({ message: 'Unauthorized' });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    res.send({ message: 'Protected content', user });
  } catch (error) {
    res.status(403).send({ message: 'Invalid token' });
  }
};
```

##### Route Protection

###### Using Middleware

```typescript
import { NextApiRequest, NextApiResponse } from 'next';

export const requireAuth =
  (handler) => async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.cookies.token;

    if (!token) return res.redirect('/login');

    return handler(req, res);
  };
```

##### Client-Side Handling

###### Login Function

```typescript
const login = async (username: string, password: string) => {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (response.ok) {
    const { token } = await response.json();
    document.cookie = `token=${token}; path=/`;
  } else {
    alert('Login failed');
  }
};
```

###### Logout Function

```typescript
const logout = () => {
  document.cookie = 'token=; Max-Age=0; path=/;';
};
```

### Best Practices for Authentication in SSR

- **Use Secure Cookies**: When setting cookies, consider using `HttpOnly` and `Secure` flags to enhance security.
- **CSRF Protection**: Implement Cross-Site Request Forgery protection, especially for state-changing requests.
- **Token Expiration**: Ensure that tokens have expiration times and consider implementing refresh tokens.
- **Error Handling**: Provide clear error messages and handle authentication errors gracefully on the client side.

## Styling SSR Applications

### Styling Techniques in SSR

#### CSS-in-JS Libraries

##### Styled Components

```bash
npm install styled-components
npm install @types/styled-components --save-dev
```

```javascript
// server.js
import express from 'express';
import { renderToString } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import App from './App';

const app = express();

app.get('/', (req, res) => {
  const sheet = new ServerStyleSheet();
  const html = renderToString(sheet.collectStyles(<App />));
  const styleTags = sheet.getStyleTags(); // or sheet.getStyleElement();

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>SSR with Styled-Components</title>
        ${styleTags}
      </head>
      <body>
        <div id="app">${html}</div>
      </body>
    </html>
  `);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

##### Emotion

```bash
npm install @emotion/react @emotion/server
```

```javascript
// server.js
import express from 'express';
import { renderToString } from 'react-dom/server';
import { CacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import createCache from '@emotion/cache';
import App from './App';

const app = express();
const cache = createCache({ key: 'css' });
const { extractCriticalToChunks } = createEmotionServer(cache);

app.get('/', (req, res) => {
  const html = renderToString(
    <CacheProvider value={cache}>
      <App />
    </CacheProvider>
  );
  const { styles } = extractCriticalToChunks(html);

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>SSR with Emotion</title>
        <style data-emotion="css">${styles}</style>
      </head>
      <body>
        <div id="app">${html}</div>
      </body>
    </html>
  `);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

#### Traditional CSS Methods

```css
/* styles.css */
.container {
  padding: 20px;
  background-color: #f0f0f0;
}
```

```javascript
// server.js
import express from 'express';
import { renderToString } from 'react-dom/server';
import App from './App';
import path from 'path';

const app = express();

app.use(express.static(path.join(__dirname, 'public'))); // server static files

app.get('/', (req, res) => {
  const html = renderToString(<App />);

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>SSR with Traditional CSS</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <div id="app">${html}</div>
      </body>
    </html>
  `);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
};
```

## Optimizing SSR Performance

### Code Splitting

```tsx
import React, { Suspense } from 'react';

const LazyComponent = React.lazy(() => import('./LazyComponent'));

const App: React.FC = () => (
  <div>
    <h1>Hello, World!</h1>
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  </dvi>
);
```

When using SSR, it's important to ensure that the server can handle lazy-loaded components. This requires fetching the necessary data on the server side before rendering.

### Lazy Loading

```tsx
import React, { useState, useEffect } from 'react';

const LazyImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          imgObserver.disconnect();
        }
      });
    });

    const imgElement = document.getElementById('alt');

    if (imgElement) {
      imgObserver.observe(imgElement);
    }

    return () => {
      imgObserver.disconnect();
    };
  }, [alt]);

  return <img id={alt} src={isVisible ? src : ''} alt={alt} />;
};
```

### Reducing Server Response Times

1. **Optimize Server Configuration**
   - Use a lightweight server framework like `express` for handling requests.
   - Utilize caching strategies to store frequently accessed data.
1. **Use Compression**
   - Enable gzip or Brotli compression for responses, reducing the amount of data sent over the network.
1. **Database Optimization**
   - Optimize database queries to reduce response times. Consider using indexing and caching mechanisms.
1. **Implementing CDN**
   - Utilize a Content Delivery Network (CDN) to serve static assets, reducing load on the main server.

```javascript
import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

const server = express();

server.use(express.static('public'));

server.get('/', (req, res) => {
  const appHtml = renderToString(<App />);

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>SSR App</title>
      </head>
      <body>
        <div id="root">${appHtml}</div>
        <script src="/bundle.js"></script>
      </body>
    </html>
  `);
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

### Monitoring and Measuring Performance

## Testing React SSR Applictions

## Deploying React SSR Application

### Setting up a React SSR Application

#### Initialize the Project

```bash
pnpm init
pnpm add react react-dom express
pnpm add -D typescript @types/react @types/react-dom @types/express
```

#### Create Basic File Structure

```bash
/my-ssr-app
|-- /src
|   |-- /components
|   |-- /pages
|   |-- /server
|   |-- App.tsx
|-- tsconfig.json
|-- package.json
```

#### Configure TypeScript

```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "jsx": "react",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

#### Implement Server-Side Rendering

```javascript
import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

const server = express();

server.get('*', (req, res) => {
  const appString = renderToString(<App />);
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>React SSR App</title>
      </head>
      <body>
        <div id="root">${appString}</div>
      </body>
    </html>
  `;

  res.send(html);
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

#### Running the Application

```bash
node dist/server.js
```

## Real-Life Project: Building a E-Commerce Application

### Setting up the Development Environment

```bash
pnpm init
pnpm add react react-dom express
pnpm add -D typescript @types/react @types/react-dom @types/express @types/node ts-node nodemon
```

### Creating the Project Structure

```bash
/e-commerce-app
|-- /client
|   |-- /components
|   |-- /pages
|   |-- /styles
|   |-- App.tsx
|   |-- index.tsx
|-- /server
|   |-- /routes
|   |-- /models
|   |-- server.ts
|-- package.json
|-- tsconfig.json
```

### Setting up TypeScript

```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "jsx": "react",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["client/**/*", "server/**/*"],
  "exclude": ["node_modules"]
}
```

### Implementing Server-Side Rendering

### Building Product Listings

### User Authentication

### Payment Processing

See the complete [code](https://github.com/tEgRaT/e-commerce-app) for more details.
