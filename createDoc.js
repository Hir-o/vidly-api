const mongoose = require('mongoose');
const dbDebugger = require('debug')('app:db');

mongoose.connect('mongodb://localhost/tv_db')
    .then(() => dbDebugger('Connected to MongoDB tv_db database...'))
    .catch((err) => dbDebugger("Could not connect to MongoDB tv_db", err));


const movieSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minLength: 3,
        maxLength: 255
    },
    genre:{
        type: Array,
        validate:{
            validator: function(v){return v.length > 0},
            message: 'A movie should have at least one category!'
        }
    },
    rating:{
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
    releaseDate: {type: Date, default: Date.now},
});

const tvShowSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minLength: 3,
        maxLength: 255
    },
    genre:{
        type: Array,
        validate:{
            validator: function(v){return v.length > 0},
            message: 'A movie should have at least one category!'
        }
    },
    rating:{
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
    firstEpisodeDate: {type: Date, default: Date.now},
});

const Movie = mongoose.model('Movie', movieSchema);
const TvShow = mongoose.model('TvShow', tvShowSchema);

async function createRecord(){
    // const movie = new Movie({
    //     name: 'The Matrix',
    //     genre: ['Action', 'Sci-Fi', 'Cyberpunk'],
    //     rating: 8.7,
    //     releaseDate: '1999-03-31'
    // });

    // try{
    //     const result = await movie.save();
    //     console.log(result);
    // }catch(ex){
    //     console.error('Exception', ex.message);
    // }

    const tvShow = new TvShow({
        name: 'Breaking Bad',
        genre: ['Crime', 'Drama', 'Tragedy'],
        rating: 9.5,
        firstEpisodeDate: '2008-01-20'
    });

    try{
        const result = await tvShow.save();
        console.log(result);
    } catch (ex){
        console.error('Error:', ex.message);
    }
}

createRecord();