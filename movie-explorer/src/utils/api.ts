import axios from 'axios';
import type { IMovie, IMovieDetails } from '../types/movie';

const API_KEY = '4e44d9029b1270a757cddc766a1bcb63';
const BASE_URL = 'https://api.themoviedb.org/3';

const api = axios.create({
  baseURL: BASE_URL,
  params: { api_key: API_KEY },
});

export const searchMovies = async (
  query: string,
  page = 1
): Promise<{ results: IMovie[]; total_pages: number }> => {
  const { data } = await api.get('/search/movie', { params: { query, page } });
  return data;
};

export const getPopularMovies = async (
  page = 1
): Promise<{ results: IMovie[]; total_pages: number }> => {
  const { data } = await api.get('/movie/popular', { params: { page } });
  return data;
};

export const getMovieDetails = async (id: number): Promise<IMovieDetails> => {
  const { data } = await api.get(`/movie/${id}`);
  return data;
};

export const getImageUrl = (
  path: string | null,
  size: 'w500' | 'original' = 'w500'
) => {
  return path
    ? `https://image.tmdb.org/t/p/${size}${path}`
    : '/placeholder.png';
};
