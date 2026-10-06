import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import NewsArticlePage from './pages/NewsArticlePage';
import NewsListPage from './pages/NewsListPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="news" element={<NewsListPage />} />
          <Route path="news/:id" element={<NewsArticlePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
