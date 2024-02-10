require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

// Configuración de Express
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// Inicialización de Spotify Web API
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Solicitar un token de acceso
spotifyApi
  .clientCredentialsGrant()
  .then((data) => {
    spotifyApi.setAccessToken(data.body["access_token"]);
    // Escuchar en el puerto después de obtener el token de acceso
    const port = process.env.PORT || 3000;
    app.listen(port, () =>
      console.log(`Mi proyecto de Spotify se está ejecutando en el puerto ${port} 🎧 🥁 🎸 🔊`)
    );
  })
  .catch((error) =>
    console.log("Ocurrió un error al obtener un token de acceso", error)
  );

// Rutas
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/albums/:id", (req, res, next) => {
  const albumId = req.params.id;

  spotifyApi
    .getArtistAlbums(albumId)
    .then((data) => {
      res.render("albums", { albums: data.body.items });
    })
    .catch((err) => {
      console.log("Ocurrió un error al buscar álbumes: ", err);
      next(err);
    });
});

app.get("/artist-search", (req, res, next) => {
  const { artistName } = req.query;

  spotifyApi
    .searchArtists(artistName)
    .then((data) => {
      res.render("artist-search-results", { artists: data.body.artists.items });
    })
    .catch((err) => {
      console.log("Ocurrió un error al buscar artistas: ", err);
      next(err);
    });
});

app.get("/tracks/:id", (req, res, next) => {
  const tracksId = req.params.id;

  spotifyApi
    .getAlbumTracks(tracksId)
    .then((data) => {
      res.render("tracks", {
        tracks: data.body.items,
        albumName: data.body.name,
      });
    })
    .catch((err) => {
      console.log("Error al obtener las pistas: ", err);
      next(err);
    });
});
