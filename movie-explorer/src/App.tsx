import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Loader } from './components/Loader';
import { Home } from './components/Home';
import { MovieDetails } from './components/MovieDetails';
import { Favorites } from './components/Favorites';

export const App = () => {
  return (
    <ErrorBoundary>
      <Router>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
};
