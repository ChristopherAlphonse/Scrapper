import React, { useState } from 'react';

import Home from './component/Home';

const App = () => {
  const [url, setUrl] = useState('');
  const [seoData, setSeoData] = useState<any>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URI}/scrape?url=${url}`
      );
      const data = await res.json();
      setSeoData(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Home
      handleSubmit={handleSubmit}
      setUrl={setUrl}
      url={url}
      seoData={seoData}
    />
  );
};

export default App;
