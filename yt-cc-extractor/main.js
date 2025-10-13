console.log('YouTube CC Extractor');

fetch('https://yt-cc-extractor.netlify.app/api/transcript?video_id=9-oefwZ6Z74')
  .then(res => res.text())
  .then(data => console.log(data));
