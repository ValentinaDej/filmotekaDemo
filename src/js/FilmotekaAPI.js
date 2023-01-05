import axios from 'axios';

axios.defaults.baseURL = `https://api.themoviedb.org/3/`;

const apiKey = '6c57fb02719926393bb8c06aa147886f';

export default class FilmotekaAPI {
  constructor() {
    this._apiKey = apiKey;
    this.genre = [];
    this.query = '';
    this.page = 1;
    this.totalPages = 0;
    this.totalResults = 0;
    this.movie_id = 560;
    this.posterID = '';
    this.language = 'en-US';
  }

  //  якщо не передавати timeWeek параметра повертає масив обєктів за день, якщо true за тиждень
  async getMostPopular(timeWeek) {
    try {
      let searchTime = `trending/movie/day?api_key=${this._apiKey}&page=${this.page}&language=${this.language}`;
      if (timeWeek) {
        searchTime = `trending/movie/week?api_key=${this._apiKey}&page=${this.page}&language=${this.language}`;
      }
      const response = await axios.get(searchTime);
      this.totalPages = response.data.total_pages;
      this.totalResults = response.data.total_results;
      const array = {
        page: response.data.page,
        totalPages: response.data.total_pages,
        totalResults: response.data.total_results,
        finded: response.data.results,
      };
      return array;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Пошук фільму за ключовим словом і вибір сторінки
  async searchMovie(query) {
    try {
      this.query = query;
      const response = await axios.get(
        `search/movie?api_key=${this._apiKey}&query=${this.query}&page=${this.page}`
      );
      this.totalPages = response.data.total_pages;
      this.totalResults = response.data.total_results;
      console.log(response);
      const array = {
        finded: response.data.results,
        page: response.data.page,
        totalPages: response.data.total_pages,
        totalResults: response.data.total_results,
      };
      return array;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Отримання повної інформації кінофільму за допомогою ID
  async getInfoCardGallery(movie_id) {
    try {
      this.movie_id = movie_id;
      const response = await axios.get(
        `movie/${this.movie_id}?api_key=${this._apiKey}&language=${this.language}`
      );
      const array = {
        title: response.data.title,
        genre: response.data.genres.map(genre => genre.name).join(','),
        release: response.data.release_date,
        vote: response.data.vote_average,
        poster: this.getPoster(),
      };
      return array;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Отримання короткої інформації кінофільму за допомогою ID та ширини постеру для адаптиву та ретіни у галерею
  async getInfoCardGallery(movie_id, posterWidth) {
    try {
      const response = await axios.get(
        `movie/${movie_id}?api_key=${this._apiKey}&language=${this.language}`
      );
      const poster = this.getPoster(movie_id, posterWidth);
      const array = {
        title: response.data.title,
        genre: response.data.genres.map(genre => genre.name).join(','),
        vote: response.data.vote_average,
        poster: poster,
      };
      return array;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Отримання повної інформації кінофільму за допомогою ID  та ширини постеру для адаптиву та ретіни
  async getInfoCardModal(movie_id, posterWidth) {
    try {
      this.movie_id = movie_id;
      const response = await axios.get(
        `movie/${this.movie_id}?api_key=${this._apiKey}&language=${this.language}`
      );
      const array = {
        title: response.data.title,
        genre: response.data.genres.map(genre => genre.name).join(','),
        release: response.data.release_date,
        vote: response.data.vote_average,
        votes: response.data.vote_count,
        popularity: response.data.popularity,
        originalTitle: response.data.original_title,
        about: response.data.overview,
        poster: this.getPoster(movie_id, posterWidth),
      };
      return array;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Отримання посилання трейлера з ютуб
  async getVideo(movie_id) {
    try {
      const response = await axios.get(
        `movie/${this.movie_id}/videos?api_key=${this._apiKey}&language=${this.language}`
      );

      const videoID = response.data.results
        .map(result => result.key)
        .slice(0, 1);
      return `https://www.youtube.com/watch?v=${videoID}`;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  findClosest(x, arr) {
    var indexArr = arr.map(function (k) {
      return Math.abs(k - x);
    });
    var min = Math.min.apply(Math, indexArr);
    return indexArr.indexOf(min);
  }

  // повертає постер найближеної ширини від заданої в колбек якщо не задано 500px
  async getPoster(movie_id, posterWidth = 500) {
    try {
      const response = await axios.get(
        `movie/${movie_id}/images?api_key=${this._apiKey}`
      );
      const posterArrWidth = response.data.posters.map(poster => poster.width);
      const posterID = this.findClosest(posterWidth, posterArrWidth);
      const PosterURL = response.data.posters[posterID].file_path;
      return `https://image.tmdb.org/t/p/original${PosterURL}`;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  // повертає список жанрів
  async getGeners() {
    try {
      const response = await axios.get(
        `genre/movie/list?api_key=${this._apiKey}&language=${this.language}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // додає сторінку

  incrementPage() {
    this.page += 1;
  }

  // віднімає сторінку
  decrementPage() {
    if (this.page !== 0) {
      this.page -= 1;
    }
  }

  // обнулює до першої сторінки
  resetPage() {
    this.page = 1;
  }

  // повертає поточну сторінку
  getCurrentPage() {
    return this.page;
  }

  //встановлює потрібну сторінку
  setCurrentPage(setPage) {
    if (Number(setPage) > 0) {
      this.page = Number(setPage);
    } else {
      alert('Page must be > "0" !!!');
    }
  }

  // повертає ID відео
  getCurrentID() {
    return this.movie_id;
  }

  // встановлює потрібний  ID відео
  setCurrentID(newID) {
    this.movie_id = newID;
  }
}

// const test = new FilmotekaAPI();
// console.log(test.getGeners());
