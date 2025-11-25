export interface IMovie {
  /** Unique identifier for the movie */
  id: number;
  /** Title of the movie */
  title: string;
  /** Path to the movie poster image */
  poster_path: string | null;
  /** Path to the movie backdrop image */
  backdrop_path: string | null;
  /** Brief description of the movie */
  overview: string;
  /** Release date of the movie in YYYY-MM-DD format */
  release_date: string;
  /** Average rating score for the movie */
  vote_average: number;
  /** Total number of votes received */
  vote_count: number;
  /** Array of genre IDs associated with the movie */
  genre_ids?: number[];
  /** Array of genre objects with full details */
  genres?: IGenre[];
}

export interface IGenre {
  /** Unique identifier for the genre */
  id: number;
  /** Name of the genre */
  name: string;
}

export interface IProductionCompany {
  /** Unique identifier for the production company */
  id: number;
  /** Name of the production company */
  name: string;
  /** Path to the company logo image */
  logo_path: string | null;
}

export interface IMovieDetails extends IMovie {
  /** Runtime of the movie in minutes */
  runtime: number;
  /** Array of genre objects with full details */
  genres: IGenre[];
  /** Array of production companies involved in the movie */
  production_companies: IProductionCompany[];
}
