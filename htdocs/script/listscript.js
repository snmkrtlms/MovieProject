//script pour afficher la liste de tous les films (+ détails et boutons modifier + supprimer)
let filmDetailsPopup;

function closeFilmDetailsPopup() {
    filmDetailsPopup.classList.add('hidden');
}   

document.addEventListener('DOMContentLoaded', function() {
    const filmsContainer = document.getElementById('moviesList');
    filmDetailsPopup = document.getElementById('film-details-popup');
    const filmDetails = document.getElementById('film-details');

    createMovieButton.addEventListener('click', function() {
        // Rediriger vers la page de création de film
        window.location.href = 'createMovie.html';
    });
    
    // fct qui envoie une requête HTML GET à l'url pour récupérer tous les films du serveur 
    function fetchAndDisplayFilmCards() {
        fetch('http://127.0.0.1:8080/movies')
            // Elle traite réponse reçue en objet JSON
            .then(response => response.json())
            .then(data => {
                data.forEach((movie, index) => {
                    //Pour chaque film -> création d'une card DOM
                    const movieCard = document.createElement('div');
                    movieCard.classList.add('movie-card');

                    //Création image + ajout au card
                    const movieImage = document.createElement('img');
                    movieImage.src = movie.Poster_Link;
                    movieImage.alt = movie.Series_Title;
                    movieImage.classList.add('movie-image');
                    movieCard.appendChild(movieImage);

                    const movieDetailsContainer = document.createElement('div');
                    movieDetailsContainer.classList.add('movie-details-container');

                    //Container pour le numéro et le titre
                    const numberTitleContainer = document.createElement('div');
                    numberTitleContainer.classList.add('number-title-container');

                    //Titre du film
                    const movieTitle = document.createElement('div');
                    movieTitle.textContent = `${index + 1}. ${movie.Series_Title}`;
                    movieTitle.classList.add('movie-title');
                    numberTitleContainer.appendChild(movieTitle);

                    movieDetailsContainer.appendChild(numberTitleContainer);

                    //Affichage de l'IMDb Rating avec une étoile
                    const imdbRating = document.createElement('span');
                    imdbRating.innerHTML = `<span class="rating-label">IMDb</span> ${getStarIcon()} <span class="imdb-rating-number">${movie.IMDB_Rating}</span>`;
                    imdbRating.classList.add('imdb-rating');
                    movieDetailsContainer.appendChild(imdbRating);

                    //Création du séparateur | 
                    const separator = document.createElement('span');
                    separator.textContent = ' | ';
                    movieDetailsContainer.appendChild(separator);

                    //Metascore
                    const metascoreContainer = document.createElement('span');
                    metascoreContainer.innerHTML = `<span class="metascore-label">Metascore</span> <span class="metascore-number">${movie.Meta_score}</span>`;
                    metascoreContainer.classList.add('metascore');
                    movieDetailsContainer.appendChild(metascoreContainer);

                    movieDetailsContainer.appendChild(separator.cloneNode(true));

                    //Runtime
                    const movieRuntime = document.createElement('span');
                    movieRuntime.textContent = movie.Runtime;
                    movieRuntime.classList.add('movie-runtime');
                    movieDetailsContainer.appendChild(movieRuntime);

                    const moreDetailsContainer = document.createElement('div');
                    moreDetailsContainer.classList.add('more-details-container');

                    //Création bouton plus de détails 
                    const moreDetailsButton = document.createElement('button');
                    moreDetailsButton.textContent = 'Plus de détails';
                    moreDetailsButton.classList.add('more-details-button');
                    moreDetailsButton.setAttribute('data-movie-id', movie._id);
                    moreDetailsButton.addEventListener('click', (event) => {
                        const movieId = event.target.getAttribute('data-movie-id');
                        //Appel fct qui affiche les détails du film (ID)
                        fetchAndDisplayFilmDetails(movieId);
                    });

                    moreDetailsContainer.appendChild(moreDetailsButton);
                    
                    // Création du bouton modifier
                    const editButton = document.createElement('button');
                    editButton.textContent = 'Éditer';
                    editButton.classList.add('edit-button');
                    editButton.setAttribute('data-movie-id', movie._id);
                    editButton.addEventListener('click', (event) => {
                        const movieId = event.target.getAttribute('data-movie-id');
                        //Rediriger vers la page d'édition avec l'identifiant du film
                        window.location.href = `editMovie.html?id=${movieId}`; 
                    });
                    moreDetailsContainer.appendChild(editButton);

                    //Création du bouton "Supprimer"
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Supprimer';
                    deleteButton.classList.add('delete-button');
                    deleteButton.setAttribute('data-movie-id', movie._id);
                    deleteButton.addEventListener('click', (event) => {
                        const movieId = event.target.getAttribute('data-movie-id');
                        //Afficher la boîte de dialogue de confirmation avant de supprimer le film
                        showConfirmationPopup(movieId);
                    });
                    moreDetailsContainer.appendChild(deleteButton);

                    movieDetailsContainer.appendChild(moreDetailsContainer);

                    movieCard.appendChild(movieDetailsContainer);

                    filmsContainer.appendChild(movieCard);
                });
            })
            .catch(error => console.error('Error fetching films:', error));
    }

    // Fct pour récupérer les détails du film (ID)
    function fetchAndDisplayFilmDetails(id) {
        fetch('http://127.0.0.1:8080/movies/' + id)
            .then(response => response.json())
            .then(movie => {
                showFilmDetails(movie);
            })
            .catch(error => console.error('Error fetching film details:', error));
    }

    // Fct pour afficher les détails dans un pop up
    function showFilmDetails(movie) {
        filmDetails.innerHTML = `
            <span id="close-popup-button" onclick="closeFilmDetailsPopup()">&times;</span>
            <img src="${movie.Poster_Link}" alt="${movie.Series_Title}" class="img-popUp">
            <h2>${movie.Series_Title} (${movie.Released_Year})</h2>
            <p><strong>Director:</strong> ${movie.Director}</p>
            <p><strong>Runtime:</strong> ${movie.Runtime}</p>
            <p><strong>Genre:</strong> ${movie.Genre}</p>
            <p><strong>IMDB Rating:</strong> ${movie.IMDB_Rating}</p>
            <p><strong>Metascore:</strong> ${movie.Meta_score}</p>
            <p><strong>Overview:</strong> ${movie.Overview}</p>
        `;
        filmDetailsPopup.classList.remove('hidden');
    }

    //fct pour supprimer un film (ID)
    function deleteMovie(id) {
        fetch('http://127.0.0.1:8080/movies/' + id, { method: 'DELETE' })
            .then(function(response) {
                location.reload();
            })
            .catch(function(err) {
                console.log("Something went wrong!", err);
            });
    }

    //fct pour retourner une étoile
    function getStarIcon() {
        return '⭐️';
    }

    // fct pour confirmer la suppression d'un film 
    function showConfirmationPopup(movieId) {
        const confirmationPopup = document.getElementById('confirmation-popup');
        confirmationPopup.classList.remove('hidden');

        const confirmDeleteButton = document.getElementById('confirm-delete-button');
        confirmDeleteButton.addEventListener('click', function() {
            //fct supprimer film
            deleteMovie(movieId);
            confirmationPopup.classList.add('hidden');
        });

        const cancelDeleteButton = document.getElementById('cancel-delete-button');
        cancelDeleteButton.addEventListener('click', function() {
            confirmationPopup.classList.add('hidden');
        });
    }

    //Appel de fct afficher tous les films
    fetchAndDisplayFilmCards();
});

//fct pour scroller tout en haut
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}
