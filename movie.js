const apiKey = "237c104e";
const youtubeApiKey = "AIzaSyALK5xEcGdPSeMoW8pwUWlK8nej7kDDRXU"; // Ваш YouTube API ключ

const urlParams = new URLSearchParams(window.location.search);
const imdbID = urlParams.get('id');
const movieTitle = document.getElementById('movieTitle');
const movieDetails = document.getElementById('movieDetails');

function getMovieDetails(imdbID) {
    fetch(`http://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            movieTitle.textContent = data.Title;

            // Формирование URL запроса к YouTube API с использованием imdbID
            const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${data.imdbID}+trailer&key=${youtubeApiKey}`;

            fetch(youtubeUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Ошибка запроса к YouTube API');
                    }
                    return response.json();
                })
                .then(youtubeData => {
                    if (youtubeData.items && youtubeData.items.length > 0) {
                        // Проверка, является ли найденное видео трейлером
                        const trailerItem = youtubeData.items.find(item => {
                            const title = item.snippet.title.toLowerCase();
                            return title.includes('trailer') || title.includes('трейлер');
                        });

                        if (trailerItem) {
                            const trailerId = trailerItem.id.videoId;
                            const trailerUrl = `https://www.youtube.com/embed/${trailerId}`;

                            movieDetails.innerHTML = `
                                <p><img src="${data.Poster}" alt="${data.Title} poster"></p>
                                <p>Год: ${data.Year}</p>
                                <p>Жанр: ${data.Genre}</p>
                                <p>Режиссер: ${data.Director}</p>
                                <p>Актеры: ${data.Actors}</p>
                                <p>Сюжет: ${data.Plot}</p>
                                <iframe width="560" height="315" src="${trailerUrl}" frameborder="0" allowfullscreen></iframe> 
                            `;
                        } else {
                            // Если трейлер не найден
                            movieDetails.innerHTML = `
                                <p><img src="${data.Poster}" alt="${data.Title} poster"></p>
                                <p>Год: ${data.Year}</p>
                                <p>Жанр: ${data.Genre}</p>
                                <p>Режиссер: ${data.Director}</p>
                                <p>Актеры: ${data.Actors}</p>
                                <p>Сюжет: ${data.Plot}</p>
                                <p>Трейлер не найден.</p> 
                            `;
                        }
                    } else {
                        // Если результатов поиска нет
                        movieDetails.innerHTML = `
                            <p><img src="${data.Poster}" alt="${data.Title} poster"></p>
                            <p>Год: ${data.Year}</p>
                            <p>Жанр: ${data.Genre}</p>
                            <p>Режиссер: ${data.Director}</p>
                            <p>Актеры: ${data.Actors}</p>
                            <p>Сюжет: ${data.Plot}</p>
                            <p>Трейлер не найден.</p> 
                        `;
                    }
                })
                .catch(error => {
                    console.error("Ошибка при получении данных с YouTube:", error);
                    movieDetails.innerHTML = "<p>Произошла ошибка при загрузке трейлера.</p>";
                });
        })
        .catch(error => {
            console.error("Ошибка при получении данных:", error);
            movieDetails.innerHTML = "<p>Произошла ошибка.</p>";
        });
}

getMovieDetails(imdbID);