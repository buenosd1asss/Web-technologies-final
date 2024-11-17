// OMDb API key
const apiKey = "237c104e"; 

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const movieList = document.getElementById("movie-list");
const logoutButton = document.getElementById('logoutButton');
const profileLink = document.getElementById('profileLink');
const themeToggle = document.getElementById('themeToggle');
const genreSelect = document.getElementById('genreSelect'); 
const changeSelect = document.getElementById('changeSelect');
const newValueInput = document.getElementById('newValueInput');
const confirmPasswordInput = document.getElementById('confirmPasswordInput');

// Функция для поиска фильмов
function searchMovies(query, genre) {
    let url = `http://www.omdbapi.com/?apikey=${apiKey}`;

    if (query) {
        if (genre) {
            url += `&s=${query}&type=movie&genre=${genre}`;
        } else {
            url += `&s=${query}&type=movie`;
        }
    } else if (genre) {
        url += `&s=&type=movie&genre=${genre}`;
    } else {
        movieList.innerHTML = "<p>Введите название фильма или выберите жанр.</p>";
        return;
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.Search) {
                displayMovies(data.Search);
                localStorage.setItem('searchResults', JSON.stringify(data.Search));
            } else {
                movieList.innerHTML = "<p>Фильмы не найдены.</p>";
            }
        })
        .catch(error => {
            console.error("Ошибка при получении данных:", error);
            movieList.innerHTML = "<p>Произошла ошибка.</p>";
        });
}

// Функция для отображения фильмов
function displayMovies(movies) {
    movieList.innerHTML = "";

    movies.forEach(movie => {
        const movieElement = document.createElement("div");
        movieElement.classList.add("col-md-4", "col-lg-3", "mb-4"); 
        movieElement.innerHTML = `
            <a href="movie.html?id=${movie.imdbID}">
                <img src="${movie.Poster}" alt="${movie.Title} poster" class="movie-poster">
            </a>
            <h3 class="movie-title">${movie.Title}</h3>
            <p>Год: ${movie.Year}</p>
        `;
        movieList.appendChild(movieElement);
    });
}

// Обработчик события для кнопки поиска
if (searchButton) {
    searchButton.addEventListener("click", () => {
        const searchQuery = searchInput.value;
        const selectedGenre = genreSelect.value;
        searchMovies(searchQuery, selectedGenre);
    });
}

// Обработчик события для выбора жанра
if (genreSelect) {
    genreSelect.addEventListener('change', () => {
        const searchQuery = searchInput.value;
        const selectedGenre = genreSelect.value;
        searchMovies(searchQuery, selectedGenre);
    });
}

// Функция для выхода из аккаунта
function logout() {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Обработчик события для кнопки "Выйти"
if (logoutButton) {
    logoutButton.addEventListener('click', logout);
}

// Обработчик события для ссылки "Профиль"
if (profileLink) {
    profileLink.addEventListener('click', () => {
        window.location.href = 'profile.html';
    });
}

// --- Код для аутентификации ---
// Функция для валидации формы авторизации
function validateLoginForm() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert('Пожалуйста, введите корректный email.');
        return false;
    }

    if (password.length < 6) {
        alert('Пароль должен быть не менее 6 символов.');
        return false;
    }

    const passwordPattern = /^(?=.*[0-9])(?=.*[!@#%^&*])(?=.*[a-zA-Z]).{6,}$/;
    if (!passwordPattern.test(password)) {
        alert('Пароль должен содержать хотя бы одну цифру и один спец. символ.');
        return false;
    }

    return true;
}

// Обработчик отправки формы авторизации (login.html)
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        if (validateLoginForm()) {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const name = document.getElementById('name').value; 

            // Имитация аутентификации (локальное хранилище)
            const user = {email, password, name}; 
            localStorage.setItem('user', JSON.stringify(user));

            window.location.href = 'index.html'; 
        }
    });
}

// --- Код для профиля ---
// Функция для отображения данных профиля
function displayProfileData() {
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
        profileName.textContent = user.name; 
        profileEmail.textContent = user.email;
    } else {
        window.location.href = 'login.html';
    }
}

// Обработчик отправки формы профиля (profile.html)
const profileForm = document.getElementById('profileForm');
if (profileForm) {
    profileForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const selectedChange = changeSelect.value; 
        const newValue = document.getElementById('newValue').value;

        // Получаем текущие данные пользователя
        const user = JSON.parse(localStorage.getItem('user'));

        if (selectedChange === 'password') {
            const confirmPassword = document.getElementById('confirmPassword').value;
            if (newValue !== confirmPassword) {
                alert('Пароли не совпадают!');
                return;
            }
            user.password = newValue; 
        } else if (selectedChange === 'name') {
            user.name = newValue;
        } else if (selectedChange === 'email') {
            user.email = newValue;
        }

        localStorage.setItem('user', JSON.stringify(user));
        displayProfileData();
    });

    // Обработчик изменения выбора в select
    changeSelect.addEventListener('change', () => {
        const selectedChange = changeSelect.value;
        if (selectedChange === 'password') {
            confirmPasswordInput.style.display = 'block'; 
            newValueInput.querySelector('label').textContent = 'Новый пароль:';
            newValueInput.querySelector('input').type = 'password';
        } else {
            confirmPasswordInput.style.display = 'none'; 
            newValueInput.querySelector('label').textContent = 'Новое значение:';
            newValueInput.querySelector('input').type = 'text';
        }
    });
}

// Вызов функции при загрузке страницы profile.html
if (window.location.pathname.endsWith('profile.html')) {
    displayProfileData();
}

// --- Код для переключения тем ---
// Функция для переключения темы
function toggleTheme() {
    const lightThemeLink = document.getElementById('light-theme');
    const darkThemeLink = document.getElementById('dark-theme');

    if (lightThemeLink.disabled) {
        lightThemeLink.disabled = false;
        darkThemeLink.disabled = true;
        themeToggle.textContent = 'Темная тема';
    } else {
        lightThemeLink.disabled = true;
        darkThemeLink.disabled = false;
        themeToggle.textContent = 'Светлая тема';
    }

    localStorage.setItem('darkMode', lightThemeLink.disabled);
}

// Обработчик события для кнопки "Тема"
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);

    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true' || savedDarkMode === null) { 
        document.getElementById('light-theme').disabled = true;
        document.getElementById('dark-theme').disabled = false;
        themeToggle.textContent = 'Светлая тема'; 
    } else {
        document.getElementById('light-theme').disabled = false;
        document.getElementById('dark-theme').disabled = true;
        themeToggle.textContent = 'Темная тема'; 
    }
}

// --- Код для получения фильмов ---
// Функция для получения фильмов (популярные)
function getFeaturedMovies() {
    fetch(`http://www.omdbapi.com/?s=movie&apikey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.Search) {
                displayMovies(data.Search);
            } else {
                movieList.innerHTML = "<p>Фильмы не найдены.</p>";
            }
        })
        .catch(error => {
            console.error("Ошибка при получении данных:", error);
            movieList.innerHTML = "<p>Произошла ошибка.</p>";
        });
}

// Вызов функции для получения фильмов при загрузке страницы
if (window.location.pathname.endsWith('index.html')) {
    getFeaturedMovies();
}
