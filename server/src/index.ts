import cheerio from 'cheerio';
import express from 'express';
import request from 'request';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  const url = req.query.url as string;
  if (!url) {
    res.send('Please provide a URL');
    return;
  }

  request(url, (error, response, html) => {
    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(html);
      const title = $('title').text();
      const metaDescription = $('meta[name="description"]').attr('content');
      const metaKeywords = $('meta[name="keywords"]').attr('content');
      const canonicalUrl = $('link[rel="canonical"]').attr('href');
      const ogTitle = $('meta[property="og:title"]').attr('content');
      const ogDescription = $('meta[property="og:description"]').attr(
        'content',
      );
      const ogImage = $('meta[property="og:image"]').attr('content');

      const result = {
        title,
        metaDescription,
        metaKeywords,
        canonicalUrl,
        ogTitle,
        ogDescription,
        ogImage,
      };

      res.json(result);
    } else {
      res.send('Error: ' + error);
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
