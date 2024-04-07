// Import necessary modules and routes
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const dbConnection = require('./config/db.config');
const dotenv = require('dotenv');


const loginRoute = require('./routes/userLogin');
const getAllUsersRoute = require('./routes/userGetAllUsers');
const registerRoute = require('./routes/userSignUp');
const getUserByIdRoute = require('./routes/userGetUserById');
const editUserRoute = require('./routes/userEditUser');
const deleteUserRoute = require('./routes/userDeleteAll');
const editUserNoteRoute = require("./routes/editUserNote");
const postUserNoteRoute = require("./routes/postUserNote");
const deleteUserNoteRoute = require("./routes/deleteUserNote");
const getUserNoteRoute = require("./routes/getUserNote");
const createHighlightRoute = require("./routes/highlightCreateHighlight");
const highlightGetAllRoute = require("./routes/highlightGetAll");
const highlightDeleteAllRoute = require("./routes/highlightDeleteAll");
const highlightUpdate = require("./routes/highlightUpdate");
const getUserHighlightRoute = require ("./routes/getUserHighlight");
const addNewFavoriteRoute = require('./routes/addNewFavorite');
const favoriteGetAllFavRoute = require('./routes/favoriteGetAllFav');
const deleteAllFavoriteRoute = require('./routes/deleteAllFavorite');
const editFavoriteRoute = require('./routes/editFavorite');
const deleteFavorite = require('./routes/deleteFavorite');
const getAllByUserIdRoute = require('./routes/getAllByUserId');
const postImageRoute = require('./routes/postImage');
const getImageRoute = require('./routes/getImage');



// Load environment variables
dotenv.config();
const SERVER_PORT = process.env.SERVER_PORT || 8081;

dbConnection();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/user', loginRoute);
app.use('/user', registerRoute);
app.use('/user', getAllUsersRoute);
app.use('/user', getUserByIdRoute);
app.use('/user', editUserRoute);
app.use('/user', deleteUserRoute);
app.use('/note', editUserNoteRoute);
app.use('/note', postUserNoteRoute);
app.use('/note', deleteUserNoteRoute);
app.use('/note', getUserNoteRoute);
app.use('/highlight', createHighlightRoute);
app.use('/highlight', highlightGetAllRoute);
app.use('/highlight', highlightDeleteAllRoute);
app.use('/highlight', highlightUpdate);
app.use('/highlight', getUserHighlightRoute);
app.use('/favorite', addNewFavoriteRoute);
app.use('/favorite', favoriteGetAllFavRoute);
app.use('/favorite', getAllByUserIdRoute);
app.use('/favorite', deleteAllFavoriteRoute);
app.use('/favorite', editFavoriteRoute);
app.use('/favorite', deleteFavorite);
app.use('/image', postImageRoute);
app.use('/image', getImageRoute);

// Start the server
app.listen(SERVER_PORT, () => {
    console.log(`The backend service is running on port ${SERVER_PORT} and waiting for requests.`);
});
