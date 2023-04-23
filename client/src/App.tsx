import './index.css';

import axios from 'axios';
import { useState } from 'react';

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

function App() {
  const [data, setData] = useState<ScrapeData>();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.get<ScrapeData>(
        `http://localhost:8080/scrape?url=${url}`
      );
      setData(response.data);
      setError('');
    } catch (error) {
      console.error(error);
      setError('An error occurred while scraping the URL.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-green-600">
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="Enter a URL to scrape"
          className="rounded-l-lg py-2 px-4 border-t mr-0 border-b border-l text-gray-800 border-gray-200 bg-white"
        />
        <button
          type="submit"
          className="px-8 rounded-r-lg bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 transition-colors duration-300"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Scrape'}
        </button>
      </form>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {data && (
        <div className="p-4 border border-gray-400 rounded-md">
          <h2 className="text-xl font-bold">{data.textContent.title}</h2>
          <p className="text-sm text-gray-500">{data.content.description}</p>
          <ul className="mt-4">
            {data.href.links.map((link: string) => (
              <li key={link}>
                <a href={link} className="text-blue-500 hover:underline">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
