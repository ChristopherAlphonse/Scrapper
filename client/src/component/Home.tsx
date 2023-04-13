import React from 'react';

export interface Props {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
  url: string;
  seoData: {
    title: string;
    description: string;
    headers: { [key: string]: string[] };
  };
}

const Home: React.FC<Props> = ({ handleSubmit, setUrl, url, seoData }) => {
  return (
    <div className="p-4 bg-gray-100 min-h-screen ">
      <h1 className="text-center text-3xl md:text-9xl hover:text-zinc-500 mb-20">
        {' '}
        Welcome to <b>Web Scrapper SEO </b>
      </h1>
      <div className="max-w-screen mx-auto bg-white p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="mb-6 ">
          <label
            htmlFor="urlInput"
            className="block text-gray-700 font-bold mb-2"
          >
            Enter a URL:
          </label>
          <div className="flex items-center border-b  border-gray-400 py-2">
            <input
              required
              type="text"
              placeholder="http://YourUrl.com"
              id="urlInput"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            />
            <button
              type="submit"
              className="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded"
            >
              Get SEO Data
            </button>
          </div>
        </form>

        <h1 className="text-2xl font-bold mb-4">{seoData.title}</h1>
        <p className="text-gray-600 mb-4">{seoData.description}</p>
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="border p-2">Tag Name</th>
              <th className="border p-2">Values</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(seoData.headers).map(([tagName, values], index) => (
              <tr key={index}>
                <td className="border p-2">{tagName}</td>
                <td className="border p-2">{values.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
