<template>
  <div align="center" class="row">
    <div class="column">
      <div v-on:paste="pasteHandler" class="pasteBox" v-bind:style="{ 'background-image': 'url(' + imageURL + ')' }">
        <template v-if="!imageURL">
          <br>
          click here and paste screenshot of slider puzzle
        </template>
      </div>
      <br>
      <table v-if="grid[0]">
        <tr v-for="(_, n) in 5">
          <td class="puzzleSquare" v-for="(_, m) in 5"
              v-bind:style="{ 'background-image': 'url(' + grid[n * 5 + m] + ')' }">
            {{ puzzle[n * 5 + m] }}
          </td>
        </tr>
      </table>
    </div>
    <div class="column">
      <div v-on:paste="pasteHandler2" class="pasteBox" v-bind:style="{ 'background-image': 'url(' + imageURL2 + ')' }">
        <template v-if="!imageURL2">
          <br>
          click here and paste screenshot of slider puzzle hint
        </template>
      </div>
      <br>
      <table v-if="grid2[0]">
        <tr v-for="(_, n) in 5">
          <td class="puzzleSquare" v-for="(_, m) in 5"
              v-bind:style="{ 'background-image': 'url(' + grid2[n * 5 + m] + ')' }">
            {{ n * 5 + m }}
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
  import 'jimp/browser/lib/jimp';

  export default {
    name: 'Slider',
    data() {
      return {
        image: null,
        imageURL: null,
        image2: null,
        imageURL2: null,
        bounds: null,
        puzzle: [],
        grid: [],
        grid2: []
      }
    },
    methods: {
      pasteHandler(e) { // find a rough bounds for the slider based on the initial image
        const item = e.clipboardData.items[0];
        if (item.type.indexOf('image') >= 0) {
          const reader = new FileReader();
          reader.addEventListener('load', () => {
            this.image = reader.result;

            Jimp.read(this.image).then(image => {
              let xSimilar = new Array(image.bitmap.width).fill(null).map(() => new Array(image.bitmap.height).fill(0));
              let ySimilar = new Array(image.bitmap.width).fill(null).map(() => new Array(image.bitmap.height).fill(0));
              image.blur(1);

              for (let x = 1; x < image.bitmap.width - 1; ++x) {
                for (let y = 1; y < image.bitmap.height - 1; ++y) {
                  let currColor = Jimp.intToRGBA(image.getPixelColor(x, y));
                  let prevXColor = Jimp.intToRGBA(image.getPixelColor(x - 1, y));
                  let prevYColor = Jimp.intToRGBA(image.getPixelColor(x, y - 1));

                  xSimilar[x][y] = this.colorDiff(currColor, prevXColor) < 0.00007 ? 1 : 0;
                  ySimilar[x][y] = this.colorDiff(currColor, prevYColor) < 0.00007 ? 1 : 0;
                }
              }
              const xSimilarSmoothed = new Array(image.bitmap.width).fill(null).map(() => new Array(image.bitmap.height).fill(false));
              const ySimilarSmoothed = new Array(image.bitmap.width).fill(null).map(() => new Array(image.bitmap.height).fill(false));
              for (let x = 1; x < image.bitmap.width - 1; ++x) {
                for (let y = 1; y < image.bitmap.height - 1; ++y) {
                  xSimilarSmoothed[x][y] = xSimilar[x - 1][y - 1] + xSimilar[x - 1][y] + xSimilar[x - 1][y + 1] + xSimilar[x][y - 1] + xSimilar[x][y] + xSimilar[x][y + 1] + xSimilar[x + 1][y - 1] + xSimilar[x + 1][y] + xSimilar[x + 1][y + 1] >= 5;
                  ySimilarSmoothed[x][y] = ySimilar[x - 1][y - 1] + ySimilar[x - 1][y] + ySimilar[x - 1][y + 1] + ySimilar[x][y - 1] + ySimilar[x][y] + ySimilar[x][y + 1] + ySimilar[x + 1][y - 1] + ySimilar[x + 1][y] + ySimilar[x + 1][y + 1] >= 5;
                }
              }
              xSimilar = xSimilarSmoothed;
              ySimilar = ySimilarSmoothed;

              const xLines = new Array(image.bitmap.height).fill(null).map(() => new Object());
              const yLines = new Array(image.bitmap.width).fill(null).map(() => new Object());
              for (let x = 1; x < image.bitmap.width; ++x) {
                let lineStart = 1;
                let lineLength = 0;
                for (let y = 1; y < image.bitmap.height; ++y) {
                  if (ySimilar[x][y]) {
                    if (ySimilar[x][y - 1]) {
                      lineLength++;
                    } else {
                      lineStart = y;
                      lineLength = 0;
                    }
                  }
                  if (!ySimilar[x][y] || y === image.bitmap.height - 1) {
                    if (ySimilar[x][y - 1] && lineLength > 0) {
                      const tolerance = Math.floor(lineLength * 0.05);
                      for (let i = 0; i < Math.min(lineLength, tolerance); i++) {
                        yLines[x][lineStart + i] = lineLength - i;
                      }
                    }
                  }
                }
              }
              for (let y = 1; y < image.bitmap.height; ++y) {
                let lineStart = 1;
                let lineLength = 0;
                for (let x = 1; x < image.bitmap.width; ++x) {
                  if (xSimilar[x][y]) {
                    if (xSimilar[x - 1][y]) {
                      lineLength++;
                    } else {
                      lineStart = x;
                      lineLength = 0;
                    }
                  }
                  if (!xSimilar[x][y] || x === image.bitmap.width - 1) {
                    if (xSimilar[x - 1][y] && lineLength > 0) {
                      const tolerance = Math.floor(lineLength * 0.05);
                      for (let i = 0; i < Math.min(lineLength, tolerance); i++) {
                        xLines[y][lineStart + i] = lineLength - i;
                      }
                    }
                  }
                }
              }
              const bounds = [];
              for (let y = 1; y < image.bitmap.height; ++y) {
                for (let x in xLines[y]) {
                  const size = xLines[y][x];
                  x = parseInt(x);
                  const tolerance = Math.floor(size * 0.05);
                  const toleranceRange = [...Array(2 * tolerance + 1).keys()].map(n => n - tolerance);
                  let horizLineIdxs = [...Array(6).keys()].map(idx => y + Math.round(size * idx / 5));
                  let vertLineIdxs = [...Array(6).keys()].map(idx => x + Math.round(size * idx / 5));
                  if (horizLineIdxs.every(hLine => toleranceRange.some(yTol => xLines[hLine + yTol] && Math.abs(size - xLines[hLine + yTol][x]) < tolerance)) &&
                    vertLineIdxs.every(vLine => toleranceRange.some(xTol => yLines[vLine + xTol] && Math.abs(size - yLines[vLine + xTol][y]) < tolerance))) {
                    bounds.push([x, y, size]);
                  }
                }
              }
              const medSize = bounds.sort((a, b) => a[2] - b[2])[Math.floor(bounds.length / 2)][2];

              const gridFiltered = bounds.filter(e => e[2] > 0.8 * medSize);
              this.bounds = [gridFiltered.sort((a, b) => a[0] - b[0])[Math.floor(gridFiltered.length / 2)][0] - 4,
                gridFiltered.sort((a, b) => a[1] - b[1])[Math.floor(gridFiltered.length / 2)][1] - 4,
                gridFiltered.sort((a, b) => a[2] - b[2])[Math.floor(gridFiltered.length / 2)][2] + 8];
              //TODO for lockbox: .autocrop(0.0007, false)
              image.crop(this.bounds[0], this.bounds[1], this.bounds[2], this.bounds[2]);
              image.getBase64(Jimp.MIME_PNG, (err, url) => {
                this.imageURL = url
              });
            });
          }, false);
          reader.readAsDataURL(item.getAsFile());
        }
      },
      pasteHandler2(e) { // use image difference between images to extract puzzle tiles and determine puzzle state
        if (!this.bounds) {
          return;
        }
        const item = e.clipboardData.items[0];
        if (item.type.indexOf('image') >= 0) {
          const reader = new FileReader();
          reader.addEventListener('load', () => {
            this.image2 = reader.result;
            Jimp.read(this.image2).then(image2 => {
              Jimp.read(this.image).then(image1 => {
                image1.crop(this.bounds[0], this.bounds[1], this.bounds[2], this.bounds[2]);
                image2.crop(this.bounds[0], this.bounds[1], this.bounds[2], this.bounds[2]);
                this.cropSame(image1, image2);
                const squareWidth = image1.bitmap.width / 5;
                const squareHeight = image1.bitmap.height / 5;
                const puzzleSquares = [];
                const solutionSquares = [];
                this.grid = [];
                this.grid2 = [];
                for (let y = 0; y < 5; ++y) {
                  for (let x = 0; x < 5; ++x) {
                    const sq1 = image1.clone().crop(squareWidth * x, squareHeight * y, squareWidth, squareHeight);
                    const sq2 = image2.clone().crop(squareWidth * x, squareHeight * y, squareWidth, squareHeight);
                    this.cropSame(sq1, sq2);
                    puzzleSquares.push(sq1);
                    solutionSquares.push(sq2);

                    sq1.getBase64(Jimp.MIME_PNG, (err, url) => {
                      this.grid[x + 5 * y] = url
                    });
                    sq2.getBase64(Jimp.MIME_PNG, (err, url) => {
                      this.grid2[x + 5 * y] = url
                    });
                  }
                }
                const squareMapping = puzzleSquares.map(solSq => {
                  const dist = solutionSquares.map(sq => {
                    return Jimp.diff(sq, solSq).percent;
                  });
                  return dist.indexOf(Math.min(...dist));
                });
                if (new Set(squareMapping).size !== 25) {
                  return "error";
                }
                this.puzzle = squareMapping;

                image1.getBase64(Jimp.MIME_PNG, (err, url) => {
                  this.imageURL = url
                });
                image2.getBase64(Jimp.MIME_PNG, (err, url) => {
                  this.imageURL2 = url
                });
              });
            });
          }, false);
          reader.readAsDataURL(item.getAsFile());
        }
      },
      colorDiff(pixel1, pixel2) {
        return Math.abs(
          Math.max((pixel1.r - pixel2.r) ^ 2, (pixel1.r - pixel2.r - pixel1.a + pixel2.a) ^ 2) +
          Math.max((pixel1.g - pixel2.g) ^ 2, (pixel1.g - pixel2.g - pixel1.a + pixel2.a) ^ 2) +
          Math.max((pixel1.b - pixel2.b) ^ 2, (pixel1.b - pixel2.b - pixel1.a + pixel2.a) ^ 2)
        ) / (256 * 256 * 3);
      },
      cropSame(img1, img2) {
        const image = img1.clone();
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {

          image.bitmap.data[idx + 0] = img2.bitmap.data[idx + 0] - img1.bitmap.data[idx + 0];
          image.bitmap.data[idx + 1] = img2.bitmap.data[idx + 1] - img1.bitmap.data[idx + 1];
          image.bitmap.data[idx + 2] = img2.bitmap.data[idx + 2] - img1.bitmap.data[idx + 2];
        });
        let leftFrame = 0;
        for (let x = 0; x < image.bitmap.width; ++x) {
          let breakLoop = false;
          for (let y = 0; y < image.bitmap.height; ++y) {
            const idx = image.getPixelIndex(x, y);
            if (image.bitmap.data[idx + 0] > 0 || image.bitmap.data[idx + 1] > 0 || image.bitmap.data[idx + 2] > 0) {
              breakLoop = true;
              break;
            }
          }
          if (breakLoop) {
            break;
          }
          leftFrame++;
        }

        let topFrame = 0;
        for (let y = 0; y < image.bitmap.height; ++y) {
          let breakLoop = false;
          for (let x = 0; x < image.bitmap.width; ++x) {
            const idx = image.getPixelIndex(x, y);
            if (image.bitmap.data[idx + 0] > 0 || image.bitmap.data[idx + 1] > 0 || image.bitmap.data[idx + 2] > 0) {
              breakLoop = true;
              break;
            }
          }
          if (breakLoop) {
            break;
          }
          topFrame++;
        }

        let rightFrame = 0;
        for (let x = image.bitmap.width - 1; x > -1; --x) {
          let breakLoop = false;
          for (let y = image.bitmap.height - 1; y > -1; --y) {
            const idx = image.getPixelIndex(x, y);
            if (image.bitmap.data[idx + 0] > 0 || image.bitmap.data[idx + 1] > 0 || image.bitmap.data[idx + 2] > 0) {
              breakLoop = true;
              break;
            }
          }
          if (breakLoop) {
            break;
          }
          rightFrame++;
        }

        let bottomFrame = 0;
        for (let y = image.bitmap.height - 1; y > -1; --y) {
          let breakLoop = false;
          for (let x = image.bitmap.width - 1; x > -1; --x) {
            const idx = image.getPixelIndex(x, y);
            if (image.bitmap.data[idx + 0] > 0 || image.bitmap.data[idx + 1] > 0 || image.bitmap.data[idx + 2] > 0) {
              breakLoop = true;
              break;
            }
          }
          if (breakLoop) {
            break;
          }
          bottomFrame++;
        }

        if (bottomFrame === topFrame && leftFrame === rightFrame) {
          return;
        }

        img1.crop(leftFrame, topFrame, image.bitmap.width - leftFrame - rightFrame, image.bitmap.height - topFrame - bottomFrame);
        img2.crop(leftFrame, topFrame, image.bitmap.width - leftFrame - rightFrame, image.bitmap.height - topFrame - bottomFrame);
      }
    },
    computed: {},
    mounted() {
    },
    watch: {},
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .row {
    display: flex;
  }

  .column {
    flex: 50%;
  }

  table {
    border-collapse: collapse;
  }

  td {
    padding: 0;
    width: 50px;
    height: 50px;
    text-align: center;
  }

  .puzzleSquare {
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    -webkit-text-stroke: 1px white;
  }

  .pasteBox {
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    height: 250px;
    width: 250px;
  }
</style>
