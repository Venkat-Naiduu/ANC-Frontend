import React, { useState } from 'react';
import EntityInputForm from './components/EntityInput/EntityInputForm';
import Dashboard from './components/Dashboard/Dashboard';

const App = () => {
  const [results, setResults] = useState([]);

  return (
    <>
      <EntityInputForm onApiResponse={setResults} />
      <Dashboard results={results} />
    </>
  );
};

export default App; 