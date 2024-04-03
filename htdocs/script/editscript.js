//script pour modifier le film
document.addEventListener('DOMContentLoaded', function() {
    const editMovieForm = document.getElementById('editMovieForm');

    // Récupérer l'identifiant du film depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');
    console.log('Movie ID:', movieId);

    // Fonction pour récupérer les détails du film depuis le serveur
    function fetchMovieDetails(movieId) {
        fetch(`http://127.0.0.1:8080/movies/${movieId}`)
            .then(response => response.json())
            .then(movie => {
                // Préremplir les champs du formulaire avec les détails du film
                document.getElementById('Poster_Link').value = movie.Poster_Link;
                document.getElementById('Series_Title').value = movie.Series_Title;
                document.getElementById('Released_Year').value = movie.Released_Year;
                document.getElementById('Runtime').value = movie.Runtime;
                // Remplissez d'autres champs si nécessaire
            })
            .catch(error => console.error('Error fetching movie details:', error));
    }

    // Appel de la fonction pour récupérer les détails du film et préremplir le formulaire
    fetchMovieDetails(movieId);

    // Écouteur d'événements pour soumettre le formulaire
    editMovieForm.addEventListener('submit', function(event) {
        // console.log("form soumis !");
        event.preventDefault();
        const updatedMovie = {
            Poster_Link: document.getElementById('Poster_Link').value || '',
            Series_Title: document.getElementById('Series_Title').value || '',
            Released_Year: document.getElementById('Released_Year').value || '',
            Runtime: document.getElementById('Runtime').value || ''
            // Récupérez d'autres valeurs des champs du formulaire si nécessaire
        };
        // Envoyer les données mises à jour au serveur pour mettre à jour le film correspondant
        updateMovie(movieId, updatedMovie);
    });

    // Fonction pour mettre à jour les détails du film sur le serveur
    function updateMovie(movieId, updatedMovie) {
        fetch('http://127.0.0.1:8080/movies/' + movieId, {
            method: 'PUT',
            headers: {
                // Type de contenu attendu (JSON) par le serveur 
                'Content-Type': 'application/json'
            },
            //données transformer en JSON avant d'être envoyés au serveur
            body: JSON.stringify(updatedMovie)
        })
        .then(response => {
            if (response.ok) {
                // Si ok rediriger vers la liste de films
                console.log('Movie details updated successfully.');
                window.location.href = 'liste.html';
            } else {
                // Sinn message d'erreur
                console.error('Failed to update movie details.');
            }
        })
        .catch(error => console.error('Error updating movie details:', error));
    }
});
