const fs = require('fs');
const PNG = require('pngjs').PNG;



// Takes an image and makes it black
function DarkenImage(image){
  return new Promise((resolve) => {
  fs.createReadStream(image)
      .pipe(new PNG({
          filterType: 4
      }))
      .on('parsed', function() {
          for (var y = 0; y < this.height; y++) {
              for (var x = 0; x < this.width; x++) {
                  const idx = (this.width * y + x) << 2;
                  this.data[idx] = 0;
                  this.data[idx+1] = 0;
                  this.data[idx+2] = 0;
              }
          }
          let stream = fs.createWriteStream('./images/unknown.png');

          this.pack().pipe(stream);
          stream.on('finish', resolve);
      });
  })
}

module.exports = {
  DarkenImage,
};
