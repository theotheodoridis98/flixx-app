const global = {
  currentPage: window.location.pathname,
};

//Function to show spinner while the data are being fetched
function showSpinner() {
  document.querySelector('.spinner').classList.add('show');
}
//Function to hide spinner
function hideSpinner() {
  document.querySelector('.spinner').classList.remove('show');
}

// Fetch data from TMDB API
async function fetchAPIData(endpoint) {
  const API_URL = 'https://api.themoviedb.org/3/';
  const API_KEY = 'ae4fecc767d53ab9d4986a4738c0ae24';

  try {
    showSpinner();
    const response = await fetch(
      `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    hideSpinner();
    return data;
  } catch (error) {
    console.error('Fetch API Error:', error);
    return { results: [] }; // Prevent crashes!
  }
}

// Function to display popular movies
async function displayPopularMovies() {
  const { results: popularMovies } = await fetchAPIData('movie/popular'); // Fix: Corrected endpoint from 'movies/popular' to 'movie/popular'

  if (!popularMovies || popularMovies.length === 0) {
    console.warn('No popular movies found.');
    return;
  }

  const moviesContainer = document.querySelector('#popular-movies');
  if (!moviesContainer) {
    console.error('Error: #popular-movies not found in the document.');
    return;
  }

  moviesContainer.innerHTML = ''; // Clear previous movies!

  popularMovies.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
          <a href="movie-details.html?id=${movie.id}">
            ${
              movie.poster_path
                ? `<img
              src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
              class="card-img-top"
              alt="${movie.title}"
            />`
                : `<img
              src="../images/no-image.jpg"
              class="card-img-top"
              alt="${movie.title}"
            />`
            } 
          </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">${
                movie.release_date || 'Unknown Release Date'
              }</small>
            </p>
          </div>`;

    moviesContainer.appendChild(div);
  });
}

// Function to display popular TV Shows
async function displayPopularSeries() {
  const { results: popularSeries } = await fetchAPIData('tv/popular');

  if (!popularSeries || popularSeries.length === 0) {
    console.warn('No popular TV series found.');
    return;
  }

  const seriesContainer = document.querySelector('#popular-shows');
  if (!seriesContainer) {
    console.error('Error: #popular-shows not found in the document.');
    return;
  }

  seriesContainer.innerHTML = ''; // Clear previous content

  popularSeries.forEach((show) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
          <a href="tv-details.html?id=${show.id}">
            ${
              show.poster_path
                ? `<img
              src="https://image.tmdb.org/t/p/w500${show.poster_path}"
              class="card-img-top"
              alt="${show.name}"
            />`
                : `<img
              src="../images/no-image.jpg"
              class="card-img-top"
              alt="${show.name}"
            />`
            } 
          </a>
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
              <small class="text-muted">${
                show.first_air_date || 'Unknown First Air Date'
              }</small>
            </p>
          </div>`;

    seriesContainer.appendChild(div);
  });
}

// Highlight active navigation link
function highlightActiveLink() {
  const links = document.querySelectorAll('.nav-link');
  links.forEach((link) => {
    const linkPath = new URL(link.href, window.location.origin).pathname;
    if (linkPath === global.currentPage) {
      link.classList.add('active');
    }
  });
}

// Initialize the app
function init() {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      console.log('Home');
      displayPopularMovies(); // Fix 1: Call displayPopularMovies()
      break;
    case '/shows.html':
      console.log('Shows');
      displayPopularSeries();
      break;
    case '/movie-details.html':
      console.log('Movie Details');
      break;
    case '/tv-details.html':
      console.log('TV details');
      break;
    case '/search.html':
      console.log('Search');
      break;
  }
  highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);
