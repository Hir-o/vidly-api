const mongoose = require('mongoose');
const dbDebugger = require('debug')('app:db');
const { Director, validateDir, directorSchema } = require('./models/director');
const { Movie, validate } = require('./models/movie');

mongoose.connect('mongodb://localhost/tv_db')
    .then(() => dbDebugger('Connected to MongoDB tv_db database...'))
    .catch((err) => dbDebugger("Could not connect to MongoDB tv_db", err));

async function createMovie(name, directors, genre, rating, releaseDate){
    const movie = new Movie({
        name,
        directors,
        genre,
        rating,
        releaseDate
    });

    const result = await movie.save();
    console.log(result);
}

async function updateMovie(id){
    let movie = await Movie.findByIdAndUpdate(id, {
        $unset:{
            director:{
                firstName: ''
            }
        }
    }, {new: true});

    console.log(movie);
}

async function addDirector(movieId, director){
    const movie = await Movie.findById(movieId);
    movie.directors.push(director);
    movie.save();
}

async function removeDirector(movieId, directorId){
    const movie = await Movie.findByIdAndUpdate(movieId, {
        $pull:{
            directors: {_id: directorId}
        }
    }, {new: true});

    console.log(movie);
    return;
    const director = movie.directors.id(directorId);
    console.log(director);
    director.remove();
    movie.save();
}

async function listMovies(){
    const movies = await Movie.find();
    console.log(movies);
}
const directors = [
    new Director({firstName: "Direktor", lastName: "Direktori"}),
    new Director({firstName: "Direktor2shi", lastName: "Direktori i dyte"}),
]
//createMovie("test2", directors, ["Action"], 10, "1992-08-12");
//updateMovie('6724cbbd2c78daaffabf23aa');
//listMovies();
//addDirector('6724ce266c88b3f878b23382', new Director({ firstName: 'Jonathan', lastName: 'Young'}));
removeDirector('6724ce266c88b3f878b23382', '6724ce266c88b3f878b23380');