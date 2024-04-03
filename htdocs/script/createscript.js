//script pour ajouter un film
document.addEventListener('DOMContentLoaded', function() {
    const createMovieForm = document.getElementById('createMovieForm');

    createMovieForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(createMovieForm);
        const movieData = {};
        formData.forEach((value, key) => {
            movieData[key] = value;
        });

        // requête HTTP utilisant l'API Fetch de JS pour envoyer les données au serveur
        fetch('http://127.0.0.1:8080/movies', {
            method: 'POST',
            headers: {
                // Type de contenu attendu (JSON) par le serveur 
                'Content-Type': 'application/json'
            },
            //données transformer en JSON avant d'être envoyés au serveur
            body: JSON.stringify(movieData)
        })
        .then(response => {
            //Si response ok
            if (response.ok) {
                // Rediriger vers la page principale après l'ajout réussi
                window.location.href = 'index.html';
            } else {
                // Sinon envoyer un message d'erreur
                console.error('Failed to add movie.');
            }
        })
        //Sinon (response pas ok)-> message d'erreur
        .catch(error => console.error('Error adding movie:', error));
    });
});

//fct pour scroller en haut
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}