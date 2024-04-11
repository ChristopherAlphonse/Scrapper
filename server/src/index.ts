import express, { Application, Request, Response } from 'express';

import cheerio from 'cheerio';
import cluster from 'cluster';
import cors from 'cors';
import os from 'os';

interface ScrapeData {
  content: {
    robots?: string;
    description?: string;
  };
  textContent: {
    title?: string;
    h1?: string;
    h2?: string;
    h3?: string;
    h4?: string;
    h5?: string;
    h6?: string;
  };
  href: {
    links: string[];
    canonical?: string;
    alternateMobile?: string;
    prevPagination?: string;
    nextPagination?: string;
    amp?: string;
  };
  outerHTML: {
    hreflang: string[];
  };
}

async function scrape(url: string): Promise<ScrapeData> {
  const nodeFetch = await import('node-fetch');
  const fetch = nodeFetch.default;
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);

  const data: ScrapeData = {
    content: {
      robots: $("meta[name='robots']").attr('content'),
      description: $("meta[name='description']").attr('content'),
    },
    textContent: {
      title: $('title').text(),
      h1: $('h1').text(),
      h2: $('h2').text(),
      h3: $('h3').text(),
      h4: $('h4').text(),
      h5: $('h5').text(),
      h6: $('h6').text(),
    },
    href: {
      links: $('a')
        .map((_, el) => $(el).attr('href') ?? '')
        .get(),
      canonical: $("link[rel='canonical']").attr('href'),
      alternateMobile: $(
        "link[media='only screen and (max-width: 640px)']",
      ).attr('href'),
      prevPagination: $("link[rel='prev']").attr('href'),
      nextPagination: $("link[rel='next']").attr('href'),
      amp: $("link[rel='amphtml']").attr('href'),
    },
    outerHTML: {
      hreflang: $('link[hreflang]')
        .map((_, el) => $(el).prop('outerHTML') || '')
        .get(),
    },
  };

  return data;
}

const app: Application = express();
const port: number = 8080;

app.use(cors()); 

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker: cluster.Worker, code: number, signal: string) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  app.get('/scrape', async (req: Request, res: Response) => {
    let url: string = req.query.url as string;

    // Check if URL starts with http or https, add protocol if not present
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `http://${url}`;
    }

    try {
      const data: ScrapeData = await scrape(url);
      res.status(200).json(data);
    } catch (error) {
      console.error(`Error scraping ${url}: ${error}`);
      res.status(500).send('Error scraping the provided URL');
    }
  });

  app.listen(port, () => {
    console.log(`Worker ${process.pid} is running on port ${port}`);
  });
}
