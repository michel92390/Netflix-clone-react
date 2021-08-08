//jshint esversion:6
import axios from 'axios';

// const keyApi = 'ac52a0429007cde25860d04fae8b507b';


const instance = axios.create({
    baseURL: "https://api.themoviedb.org/3"
});

export default instance;