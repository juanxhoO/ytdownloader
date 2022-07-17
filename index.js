const express = require('express');
const app = express();
const  cors = require('cors');

const port = 9008;
const youtubedl = require('youtube-dl-exec');
const glob = require('glob-fs')({
  gitignore: true
});

app.use(cors());

app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded({ // to support URL-encoded bodies
  extended: true
}));

//Audio Only Download
app.get('/audio_only', function (req, res) {
  let url = req.query.url_video;
  console.log(url)
  let tk = Math.floor(100000 + Math.random() * 900000);

  youtubedl(url, {
    noWarnings: true,
    noCallHome: true,
    noCheckCertificate: true,
    preferFreeFormats: true,
    youtubeSkipDashManifest: true,
    output: tk
  }).then(function (out) {
    console.log(out)
    res.status(200)
    res.send("/audio_converted/")
  })
})

app.get('/audio_converted/:id', function (req, res) {
  let token_id = 'tk-' + req.params.id;
  // async
  glob.readdir("/*.webm", function (err, files) {
    console.log(files)
    files.filter(function (file) {
      if (file.indexOf(token_id) != -1) {
        console.log(file);
        res.status(200);
        res.download(file);
      }
    })
  });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
