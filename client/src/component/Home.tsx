import React from 'react';

type Props = {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
  url: string;
  seoData: any;
};

const Home = ({ handleSubmit, setUrl, url, seoData }: Props) => {
  return (
    <div className="container mx-auto px-4 ">
      <h1 className="text-2xl font-bold mb-4">SEO Scraper</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="url">Enter URL:</label>
        <input
          type="text"
          name="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border border-gray-300 p-2 rounded-md mb-4 block w-full"
          placeholder="https://yourUrl.com"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Scrape
        </button>
      </form>
      {Object.keys(seoData).length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-bold mb-2">SEO data</h2>
          <p>
            Title: <span className="font-bold">{seoData.title}</span>
          </p>
          <p>
            Description:{' '}
            <span className="font-bold">{seoData.description}</span>
          </p>
          <p>
            Keywords: <span className="font-bold">{seoData.keywords}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
