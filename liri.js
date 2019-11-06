var keys = require("./keys.js");
var fs = require("fs");
// include the request npm package
var request = require("request");
// omdbapi wrapper, npm install omdbapi
var omdb = require("omdbapi");
var SpotifyPackage = require("node-spotify-api");
const moment = require("moment");

var filename = "log.txt";
console.log(filename);

var dotEnv = require("dotenv").config();
console.log(dotEnv);

var userCommand = process.argv[2];
var secondCommand = process.argv[3];

for (var i = 4; i < process.argv.length; i++) {
    secondCommand += "+" + process.argv[i];
}

var spotify = new SpotifyPackage(keys.spotify);

var getArtistNames = function (artist) {
    return artist.name;
};

var getSpotify = function (songName) {
    if (songName === undefined) {
        songName = "What's my age again";
    }

    spotify.search(
        {
            type: "track",
            query: songName
        },
        function (err, data) {
            if (err) {
                console.log("Error occurred: " + err);
                return;
            }

            var songs = data.tracks.items;

            for (var i = 0; i < songs.length; i++) {
                console.log(i);
                console.log("artist(s): " + songs[i].artists.map(getArtistNames));
                console.log("song name: " + songs[i].name);
                console.log("preview song: " + songs[i].preview_url);
                console.log("album: " + songs[i].album.name);
                console.log("-----------------------------------");
            }
        }
    );
};

function mySwitch(userCommand) {
    switch (userCommand) {
        case "spotify-this-song":
            getSpotify(secondCommand);
            break;

        case "movie-this":
            getMovie(secondCommand);
            break;

        case "concert-this":
            getEvent(secondCommand);
            break;
        case "artist-this":
            getArtist(secondCommand);
            break;

        case "do-what-it-says":
            doWhat();
            break;
    }
}

//OMDB Movie - command: movie-this
function getMovie() {
    var movieName = secondCommand;
    var queryUrl =
        "http://www.omdbapi.com/?t=" +
        movieName +
        "&y=&plot=short&tomatoes=true&apikey=trilogy";

    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log("================ Movie Info ================");
            console.log("Title: " + JSON.parse(body).Year);
            console.log("Release Year: " + body.Year);
            console.log("IMdB Rating: " + body.imdbRating);
            console.log("Country: " + body.Country);
            console.log("Language: " + body.Language);
            console.log("Plot: " + body.Plot);
            console.log("Actors: " + body.Actors);
            console.log("Rotten Tomatoes URL: " + body.tomatoURL);
            console.log("================= THE END ==========");
        } else {
            console.log("Error occurred.");
        }

        if (movieName === "The Grinch") {
            console.log("-----------------------");
            console.log(
                "If you haven't watched 'The Grinch', then you should: https://www.imdb.com/title/tt0170016/?ref_=fn_al_tt_2"
            );
            console.log("It's on Netflix!");
        }
    });
}
//do-what-it-says
function doWhat() {
    //Read random.txt file
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (!error);
        console.log(data.toString());
        var cmds = data.toString().split(",");
    });
}
//concert-this
function getEvent() {
    var artistName = secondCommand;
    var queryUrl =
        "https://rest.bandsintown.com/artists/" +
        artistName +
        "/events?app_id=c64e7377ddf9167af5426b26689ba3f7";

    console.log(queryUrl);
    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var body = JSON.parse(body);

            console.log("================ Event Information ================");
            console.log(body[0]);
            console.log("================== Das Ende =================");

            //function that prints the parts of one item you want
            for (var i = 0; i < body.length; i++) {
                var event = body[i];
                console.log(
                    `Country: ${event.venue.country}
City: ${event.venue.city}
${4 + 4}`
                );
            }
        } else {
            console.log("Error occurred.");
        }
        if (artistName === "Taking Back Sunday") {
            console.log("-----------------------");
            console.log("If you haven't heard of them,' then you should");
            console.log("It's on Youtube!");
        }
    });
}

function getArtist() {
    var artistName = secondCommand;
    var queryUrl =
        "https://rest.bandsintown.com/artists/" +
        artistName +
        "?app_id=c64e7377ddf9167af5426b26689ba3f7";

    console.log(queryUrl);
    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var body = JSON.parse(body);

            console.log("================ Event Info ================");
            console.log("ID: " + body.id);
            console.log("Name: " + body.name);
            console.log("URL: " + body.url);
            console.log("Image_URL: " + body.image_url);
            console.log("Thumb_URL: " + body.thumb_url);
            console.log("Facebook_Page_URL: " + body.facebook_page_url);
            console.log("==================THE END=================");
        } else {
            console.log("Error occurred.");
        }
        if (artistName === "Taking Back Sunday") {
            console.log("-----------------------");
            console.log("If you haven't heard of them,' then you should");
            console.log("It's on Youtube!");
        }
    });
}

//Call mySwitch function
mySwitch(userCommand);
