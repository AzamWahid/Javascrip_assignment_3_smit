function convertMinutesToHours(minutes) {
  var hours = Math.floor(minutes / 60);
  var remainingMinutes = minutes % 60;
  return hours + "h " + remainingMinutes + "min";
}
const genreFilter = document.getElementById('genre');
const ratingFilter = document.getElementById('rating');
const languageFilter = document.getElementById('language');
const yearFilter = document.getElementById('year');

(async function () {
  const response = await fetch("./data.json");
  const data = await response.json();



  function addGenresOption() {
    const genre = document.getElementById("genre")
    const genresSet = new Set();

    let genreOptions = '<option value="all">All Genres</option>';

    data.forEach((movie) => {
      if (Array.isArray(movie.genres)) {
        movie.genres.forEach((genre) => {
          genresSet.add(genre);
        });
      }
    });
    genreOptions += Array.from(genresSet).map((options, genre) => {
      return `${options}<option value="${options}">${options}</option>`;

    }, '');
    genre.innerHTML += genreOptions;
  }

  function addYearOption() {
    const year = document.getElementById("year")
    const yearSet = new Set();

    let yearOptions = '<option value="all">All Years</option>';

    data.forEach((movie) => {
      const yearFromDate = new Date(movie.release_date).getFullYear();
      yearSet.add(yearFromDate);
    });
    yearOptions += Array.from(yearSet).sort((a, b) => b - a).map((options, year) => {
      return `${options}<option value="${options}">${options}</option>`;
    }, '');
    year.innerHTML += yearOptions;
  }

  function addLanguageOption() {
    const language = document.getElementById("language")
    const languageSet = new Set();

    let languageOptions = '<option value="all">All Languages</option>';

    data.forEach((movie) => {
      languageSet.add(movie.original_language);
    });
    languageOptions += Array.from(languageSet).sort((a, b) => b - a).map((options, lang) => {
      return `${options}<option value="${options}">${options}</option>`;
    }, '');
    language.innerHTML += languageOptions;
  }

  function addRatingOption() {
    const rating = document.getElementById("rating")
    const ratingSet = new Set();

    let ratingOptions = '<option value="all">All</option>';

    data.forEach((movie) => {
      ratingSet.add(movie.vote_average);
    });
    ratingOptions += Array.from(ratingSet).sort((a, b) => b - a).map((options, rate) => {
      return `${options}<option value="${options}">${options}</option>`;
    }, '');
    rating.innerHTML += ratingOptions;
  }

  // main work start here
  function filterMovies(Fdata) {
    return function () {
      const selectedGenre = genreFilter.value;
      const selectedRating = ratingFilter.value;
      const selectedlanguage = languageFilter.value;
      const selectedYear = yearFilter.value;

      const filteredMovies = Fdata.filter(movie => {
        const yearFromDate = new Date(movie.release_date).getFullYear();

        const genreMatch = selectedGenre === 'all' || movie.genres.includes(selectedGenre);
        const ratingMatch = selectedRating === 'all' || movie.vote_average >= selectedRating;
        const languageMatch = selectedlanguage === 'all' || movie.original_language == selectedlanguage;
        const yearMatch = selectedYear === 'all' || yearFromDate == selectedYear;
        return genreMatch && ratingMatch && languageMatch && yearMatch;
      });



      const table = document.getElementById('table');

      let movieRows = "";

      const sortedMovies = filteredMovies.sort((a, b) => b.popularity - a.popularity);
      movieRows += `<tr><th>RANK</th><th>MOVIE</th><th>YEAR</th></tr>`;
      sortedMovies.forEach((movie, index) => {
        const year = new Date(movie.release_date).getFullYear();
        movieRows += `<tr><td>${index + 1}</td>
                          <td><div class="imgdiv"><img src="https://image.tmdb.org/t/p/w45${movie.poster_path}"></img></div>
                          <div class="moviedet"><p></p><a href='${movie.homepage}' target="_blank">${movie.title}</a>
                          <br /> <span class="certificateborder"> ${movie.certification}</span>, ${movie.genres}&#8226;  ${convertMinutesToHours(movie.runtime)} </div>
                          </td>
                          <td>${year}</td>
                      </tr>`;

      });
      table.innerHTML = movieRows;
    }
  }
  addGenresOption();
  addYearOption();
  addLanguageOption();
  addRatingOption();

  genreFilter.addEventListener('change', filterMovies(data));
  ratingFilter.addEventListener('change', filterMovies(data));
  yearFilter.addEventListener('change', filterMovies(data));
  languageFilter.addEventListener('change', filterMovies(data));

  filterMovies();
})();
