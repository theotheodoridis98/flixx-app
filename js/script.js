const global = {
  currentPage: window.location.pathname,
  search: {
    term: '',
    type: '',
    page: 1,
    totalPages: 1,
    totalResults: 0,
  },
  api: {
    apiKey: 'ae4fecc767d53ab9d4986a4738c0ae24',
    apiURL: 'https://api.themoviedb.org/3/',
  },
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
  const API_URL = global.api.apiURL;
  const API_KEY = global.api.apiKey;

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

// Make request to search API
async function searchAPIData() {
  const API_URL = global.api.apiURL;
  const API_KEY = global.api.apiKey;

  try {
    showSpinner();
    const response = await fetch(
      `${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`
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

//Display movie details
async function displayMovieDetails() {
  const movieId = window.location.search.split('=')[1];
  console.log(movieId);

  const movie = await fetchAPIData(`movie/${movieId}`);

  displayBackgroundImage('movie', movie.backdrop_path);
  console.log(movie.background_path);

  const div = document.createElement('div');
  console.log(movie.genres); //Genres come as an array of objects!
  div.innerHTML = `<div class="details-top">
          <div>
          ${
            movie.poster_path
              ? `<img
            src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
            class="card-img-top"
            alt="${movie.name}"
          />`
              : `<img
            src="../images/no-image.jpg"
            class="card-img-top"
            alt="${movie.name}"
          />`
          }
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">${movie.release_date}</p>
            <p>
              ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
            </ul>
            <a href="${
              movie.homepage
            }" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget: </span>$${addCommasToNumber(
              movie.budget
            )}</li>
            <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(
              movie.revenue
            )}</li>
            <li><span class="text-secondary">Runtime:</span> ${
              movie.runtime
            } minutes</li>
            <li><span class="text-secondary">Status:</span> ${movie.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${movie.production_companies
            .map((company) => `<span>${company.name}</span>`)
            .join(', ')}</div>
        </div>`;

  document.querySelector('#movie-details').appendChild(div);
}

// Display Show Details
async function displayShowDetails() {
  const showId = window.location.search.split('=')[1];

  const show = await fetchAPIData(`tv/${showId}`);

  // Overlay for background image
  displayBackgroundImage('tv', show.backdrop_path);

  const div = document.createElement('div');

  div.innerHTML = `
  <div class="details-top">
  <div>
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
  </div>
  <div>
    <h2>${show.name}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${show.vote_average.toFixed(1)} / 10
    </p>
    <p class="text-muted">Last Air Date: ${show.last_air_date}</p>
    <p>
      ${show.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
      ${show.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
    </ul>
    <a href="${
      show.homepage
    }" target="_blank" class="btn">Visit show Homepage</a>
  </div>
</div>
<div class="details-bottom">
  <h2>Show Info</h2>
  <ul>
    <li><span class="text-secondary">Number of Episodes:</span> ${
      show.number_of_episodes
    }</li>
    <li><span class="text-secondary">Last Episode To Air:</span> ${
      show.last_episode_to_air.name
    }</li>
    <li><span class="text-secondary">Status:</span> ${show.status}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">
    ${show.production_companies
      .map((company) => `<span>${company.name}</span>`)
      .join(', ')}
  </div>
</div>
  `;

  document.querySelector('#show-details').appendChild(div);
}

// Search Movies / Shows
async function search() {
  const queryString = window.location.search; // Get the query string from the URL
  console.log(queryString);
  const urlParams = new URLSearchParams(queryString);
  console.log(urlParams);
  console.log(urlParams.get('type'));

  global.search.type = urlParams.get('type');
  global.search.term = urlParams.get('search-term');

  if (global.search.term !== '' && global.search.term !== null) {
    // @todo - make request and display search results
    const { results, total_pages, page, total_results } = await searchAPIData();
    console.log(results);

    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results;

    if (results.length === 0) {
      showAlert('No results found!');
      return;
    }

    displaySearchResults(results);

    document.querySelector('#search-term').value = '';
  } else {
    showAlert('Please enter a search term!');
  }
}

// Function to display search results
function displaySearchResults(results) {
  //Clear previous results
  document.querySelector('#search-results').innerHTML = '';
  document.querySelector('#search-results-heading').innerHTML = '';
  document.querySelector('#pagination').innerHTML = '';

  results.forEach((result) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
          <a href="${global.search.type}-details.html?id=${result.id}">
            ${
              result.poster_path
                ? `<img
              src="https://image.tmdb.org/t/p/w500/${result.poster_path}"
              class="card-img-top"
              alt="${
                global.search.type === 'movie' ? result.title : result.name
              }"
            />`
                : `<img
              src="../images/no-image.jpg"
              class="card-img-top"
              alt="${
                global.search.type === 'movie' ? result.title : result.name
              }"
            />`
            } 
          </a>
          <div class="card-body">
            <h5 class="card-title">${
              global.search.type === 'movie' ? result.title : result.name
            }</h5>
            <p class="card-text">
              <small class="text-muted">${
                global.search.type === 'movie'
                  ? result.release_date
                  : result.first_air_date
              }</small>
            </p>
          </div>`;

    document.querySelector('#search-results-heading').innerHTML = `
      <h2>${results.length} of ${global.search.totalResults} for ${global.search.term}</h2>
      `;

    document.querySelector('#search-results').appendChild(div);
  });

  displayPagination();
}

//Create and display pagination for Search
function displayPagination() {
  const div = document.createElement('div');
  div.classList.add('pagination');
  div.innerHTML = `
          <button class="btn btn-primary" id="prev">Prev</button>
          <button class="btn btn-primary" id="next">Next</button>
          <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>`;

  document.querySelector('#pagination').appendChild(div);

  //Disable prev button if we are on the first page
  if (global.search.page === 1) {
    document.querySelector('#prev').disabled = true;
  }

  //Disable next button if we are on the last page
  if (global.search.page === global.search.totalPages) {
    document.querySelector('#prev').disabled = true;
  }

  //Next Page
  document.querySelector('#next').addEventListener('click', async () => {
    global.search.page++;
    const { results, total_pages } = await searchAPIData();
    displaySearchResults(results);
  });

  //Previous Page
  document.querySelector('#prev').addEventListener('click', async () => {
    global.search.page--;
    const { results, total_pages } = await searchAPIData();
    displaySearchResults(results);
  });
}

//Display Slider Movies
async function displaySlider() {
  const { results } = await fetchAPIData('movie/now_playing');
  console.log(results);

  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('swiper-slide');
    div.innerHTML = `
            <a href="movie-details.html?id=${movie.id}">
              <img src="https://image.tmdb.org/t/p/w500${
                movie.poster_path
              }" alt="${movie.title}" />
            </a>
            <h4 class="swiper-rating">
              <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(
                1
              )} / 10
            </h4>
          `;

    document.querySelector('.swiper-wrapper').appendChild(div);

    initSwiper();
  });
}

function initSwiper() {
  const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: { slidesPerView: 2 },
      700: { slidesPerView: 3 },
      1200: { slidesPerView: 4 },
    },
  });
}

//Display background overlay on Details Pages
function displayBackgroundImage(type, backdropPath) {
  const overlayDiv = document.createElement('div');
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backdropPath})`;
  overlayDiv.style.backgroundSize = 'cover';
  overlayDiv.style.backgroundPosition = 'center';
  overlayDiv.style.backgroundRepeat = 'no-repeat';
  overlayDiv.style.height = '100vh';
  overlayDiv.style.width = '100vw';
  overlayDiv.style.position = 'absolute';
  overlayDiv.style.top = '0';
  overlayDiv.style.left = '0';
  overlayDiv.style.zIndex = '-1';
  overlayDiv.style.opacity = '0.2';

  if (type === 'movie') {
    document.querySelector('#movie-details').appendChild(overlayDiv);
  } else {
    document.querySelector('#show-details').appendChild(overlayDiv);
  }
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

// Show Alert
function showAlert(message, className = 'error') {
  const alertEl = document.createElement('div');
  alertEl.classList.add('alert', className);
  alertEl.appendChild(document.createTextNode(message));
  document.querySelector('#alert').appendChild(alertEl);

  setTimeout(() => alertEl.remove(), 3000);
}

function addCommasToNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Initialize the app
function init() {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      console.log('Home');
      displaySlider();
      displayPopularMovies();
      break;
    case '/shows.html':
      console.log('Shows');
      displayPopularSeries();
      break;
    case '/movie-details.html':
      console.log('Movie Details');
      displayMovieDetails();
      break;
    case '/tv-details.html':
      console.log('TV details');
      displayShowDetails();
      break;
    case '/search.html':
      console.log('Search');
      search();
      break;
  }
  highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);
