import axios from 'axios';
import cheerio from 'cheerio';

interface ScrapeData {
  content: {
    robots: string;
    description: string;
  };
  textContent: {
    title: string;
    h1: string;
    h2: string;
    h3: string;
    h4: string;
    h5: string;
    h6: string;
  };
  href: {
    links: string;
    canonical: string;
    alternateMobile: string;
    prevPagination: string;
    nextPagination: string;
    amp: string;
  };
  outerHTML: {
    hreflang: string;
  };
}

async function scrape(url: string): Promise<ScrapeData> {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  // Extract content data
  const content: ScrapeData['content'] = {
    robots: $("meta[name='robots']").attr('content') || '',
    description: $("meta[name='description']").attr('content') || '',
  };

  // Extract text content data
  const textContent: ScrapeData['textContent'] = {
    title: $('title').text() || '',
    h1: $('h1').text() || '',
    h2: $('h2').text() || '',
    h3: $('h3').text() || '',
    h4: $('h4').text() || '',
    h5: $('h5').text() || '',
    h6: $('h6').text() || '',
  };

  // Extract href data
  const href: ScrapeData['href'] = {
    links: $('a').attr('href') || '',
    canonical: $("link[rel='canonical']").attr('href') || '',
    alternateMobile:
      $("link[media='only screen and (max-width: 640px)']").attr('href') || '',
    prevPagination: $("link[rel='prev']").attr('href') || '',
    nextPagination: $("link[rel='next']").attr('href') || '',
    amp: $("link[rel='amphtml']").attr('href') || '',
  };

  // Extract outerHTML data
  const outerHTML: ScrapeData['outerHTML'] = {
    hreflang: $('link[hreflang]').prop('outerHTML') || '',
  };

  return {
    content,
    textContent,
    href,
    outerHTML,
  };
}
