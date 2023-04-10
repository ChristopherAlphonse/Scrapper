import cors, { CorsOptions } from 'cors';
import express, { Request, Response } from 'express';

import axios from 'axios';
import cheerio from 'cheerio-without-node-native';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';

const { FRONTEND_URI, PORT } = process.env;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const corsOptions: CorsOptions = {
  origin: FRONTEND_URI,
  optionsSuccessStatus: 200,
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

app.get('/scrape', async (req: Request, res: Response) => {
  const { url } = req.query;

  try {
    const { data } = await axios.get(url as string);

    const $ = cheerio.load(data);
    const title = $('title').text().trim();
    const description = $('meta[name="description"]').attr('content')?.trim();
    const keywords = $('meta[name="keywords"]').attr('content')?.trim();

    res.json({ title, description, keywords });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to scrape URL' });
  }
});

app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
});

const port = PORT || 5000;

debugger;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
