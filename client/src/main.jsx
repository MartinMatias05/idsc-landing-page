import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useApi } from './hooks/useApi';
import { api } from './services/api';
import HomePage from './pages/HomePage';
import InfoPage from './pages/InfoPage';
import './styles/global.css';

function App() {
  const site = useApi(api.getSite);
  const navigation = useApi(api.getNavigation);
  return <Routes><Route path="/" element={<HomePage/>}/><Route path="*" element={<InfoPage site={site.data} navigation={navigation.data}/>}/></Routes>;
}

ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><BrowserRouter><App/></BrowserRouter></React.StrictMode>);
