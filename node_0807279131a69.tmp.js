//script serveur
//importation du module express.js (pour créer serveur HTTP et gérer routes)
const express = require('express');
//importation module body parser (middleware Express) pour voir dans req.body
const bodyParser = require('body-parser');
//middleware express qui gère les autorisations d'accès
const cors = require('cors');
//Pour se connecter à la BD
const MongoClient = require('mongodb').MongoClient;
//importation du constructeur ObjectID (pour générer des ID uniques)
const {ObjectId} = require('mongodb');

//nouvelle instance pour gérer les routes 
let app = express();

//ouverture du port
app.listen(8080);

const url = 'mongodb://127.0.0.1:27017/';
const mongoClient = new MongoClient(url);

app.use(cors());
app.use(bodyParser.json());
app.use('/', express.static(__dirname+"/htdocs"));
app.use(express.urlencoded({extended:false}));

//requête GET (tous les films)
app.get('/movies', function(request, response) {
        readMovies().then( function(moviesArray) {
            response.setHeader('Content-Type', 'application/json');
            response.status(200).send(moviesArray);
        });
});

//fct asynchrone pour récupérer les films et return en array
async function readMovies(){
    await mongoClient.connect();
    const moviesDatabase = mongoClient.db("movies");
    const imdbCollection = moviesDatabase.collection("imdb");
    let moviesArray = await imdbCollection.find().toArray();
    return moviesArray;
}

//requête GET détail du film (id)
app.get('/movies/:id', function(request, response) {
    readMovie(request.params.id).then( function(movie) {
        response.setHeader('Content-Type', 'application/json');
        response.status(200).send(movie);
    });
});

//fct asynchrone pour récupérer un film par son id et return un doc movie
async function readMovie(id){
    await mongoClient.connect();
    const moviesDatabase = mongoClient.db("movies");
    const imdbCollection = moviesDatabase.collection("imdb");
    const query = { 
        _id : new ObjectId(id)
        };
    let movie = await imdbCollection.findOne(query);
    return movie;
}

//requête DELETE supprimer un film (id)
app.delete('/movies/:id', function(request, response) {
    deleteMovie(request.params.id).then( function() {
        response.setHeader('Content-Type', 'application/json');
        response.status(200).send("Deleted");
    });
});

//fct asynchrone qui supprime film par son id
async function deleteMovie(id){
    await mongoClient.connect();
    const moviesDatabase = mongoClient.db("movies");
    const imdbCollection = moviesDatabase.collection("imdb");
    const query = { 
        _id : new ObjectId(id)
        };
    await imdbCollection.deleteOne(query);
}

//requête POST créer un film
app.post('/movies', function(request, response) {
    console.log("Requête POST reçue avec les données suivantes :", request.body);

    const movieToCreate = {};
    // Filtrer les champs non renseignés
    for (const key in request.body) {
        if (request.body[key] !== undefined) {
            movieToCreate[key] = request.body[key];
        }
    }
    //console.log("Données à mettre à jour :", movieToCreate);

    //envoie données du film en JSON
    createMovie(movieToCreate).then( function() {
        response.setHeader('Content-Type', 'application/json');
        response.status(201).send("Created");
    }).catch(function(error) {
        console.error('Error adding movie:', error);
        response.status(500).send("Failed to add movie.");
    });
});

//fct asynchrone pour créer un film et return en array
async function createMovie(newItem){
    await mongoClient.connect();
    const moviesDatabase = mongoClient.db("movies");
    const imdbCollection = moviesDatabase.collection("imdb");
    let moviesArray = await imdbCollection.insertOne(newItem);;
    return moviesArray;
}

//Requête PUT mettre à jour le film (id)
app.put('/movies/:id', function(request, response) {
    console.log("Requête PUT reçue avec les données suivantes :", request.body);

    const movieToUpdate = {};
    // Filtrer les champs non renseignés
    for (const key in request.body) {
        if (request.body[key] !== undefined) {
            movieToUpdate[key] = request.body[key];
        }
    }

    console.log("Données à mettre à jour :", movieToUpdate);

    updateMovie(request.params.id, movieToUpdate).then(function() {
        // Après la mise à jour réussie, vous pouvez renvoyer une réponse appropriée au client
        response.setHeader('Content-Type', 'application/json');
        response.status(200).send("Movie details updated successfully");
    }).catch(function(error) {
        console.error("Error updating movie details:", error);
        response.status(500).send("Failed to update movie details");
    });
});

//fct asynchrone qui met a jour le film 
async function updateMovie(idMovieParameter, updatedMovie) {
    try {
        await mongoClient.connect();
        const moviesDatabase = mongoClient.db("movies");
        const imdbCollection = moviesDatabase.collection("imdb");
        const filter = { _id: new ObjectId(idMovieParameter) };
        const updatedDocument = { $set: updatedMovie };
        const result = await imdbCollection.updateOne(filter, updatedDocument);
        // Renvoyer un message de succès après la mise à jour réussie
        return "Movie details updated successfully";
    } catch (error) {
        console.error(error);
        throw error; // Renvoyer l'erreur pour la capturer côté client
    } finally {
        await mongoClient.close();
    }
}
