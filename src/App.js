import React, { useEffect } from 'react';
import {
  BrowserRouter, Route, Switch,
} from 'react-router-dom';
import Layout from './components/Layout/Layout';
import PhraseFrequency from './components/PhraseFrequency/PhraseFrequency';
import CurrencyConverter from './components/CurrencyConverter/CurrencyConverter';

require('dotenv').config();
const axios = require('axios').default;

function App() {
  useEffect(() => {
    const pingServer = async () => {
      const res = await axios.get(`${process.env.REACT_APP_SERVER}/ping`);
      console.log(res.data);
    };
    pingServer();
  }, []);

  return (
    <BrowserRouter>
      <Layout>
        <Switch>
          <Route path="/currencyconverter">
            <CurrencyConverter />
          </Route>
        </Switch>
        <Route path="/(|phrasefrequency)">
          <PhraseFrequency />
        </Route>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
