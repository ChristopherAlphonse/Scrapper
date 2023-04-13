import Home, { Props } from './component/Home';
import React, { useState } from 'react';

const VITE_BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const App = () => {
  const [url, setUrl] = useState('');
  const [seoData, setSeoData] = useState<{
    title: string;
    description: string;
    headers: { [key: string]: string[] };
  }>({ title: '', description: '', headers: {} });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch(
      `${VITE_BACKEND_URI}/seo?url=${encodeURIComponent(url)}`
    );
    const data = await response.json();
    setSeoData(data);
  };

  const props: Props = {
    handleSubmit,
    setUrl,
    url,
    seoData,
  };

  return <Home {...props} />;
};

export default App;
