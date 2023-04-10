import * as dotenv from 'dotenv';

import cors, { CorsOptions } from 'cors';
import express, { Application, Request, Response } from 'express';

import axios from 'axios';
import cheerio from 'cheerio';
import helmet from 'helmet';
import morgan from 'morgan';

dotenv.config();

const { FRONTEND_URI, BACKEND_URI } = process.env;

const corsOptions: CorsOptions = {
  origin: FRONTEND_URI,
  optionsSuccessStatus: 200,
};

const app: Application = express();
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

interface SeoData {
  title: string;
  description: string;
  headers: {
    [key: string]: string[];
  };
}
//
app.get('/seo', async (req: Request, res: Response) => {
  const url = req.query.url as string;

  if (!url) {
    return res.status(400).send('Missing URL parameter');
  }

  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const title = $('title').text();
    const description = $('meta[name="description"]').attr('content');
    const headers: { [key: string]: string[] } = {};
    $('h1, h2, h3, h4, h5, h6').each(
      (index: number, element: CheerioElement) => {
        const tagName = $(element).prop('tagName');
        headers[tagName] = headers[tagName] || [];
        headers[tagName].push($(element).text());
      },
    );

    const seoData: SeoData = {
      title,
      description,
      headers,
    };

    res.json(seoData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

//

const port = parseInt(BACKEND_URI as string, 10) || 8080;

debugger;

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on ${port}`);
});
