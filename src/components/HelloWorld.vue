<template>
  <div align="center" v-if="loaded">
    Click on the numbers on the around the edges to match your tower puzzle
    <div v-on:paste="pasteHandler" class="pasteBox" v-bind:style="{ 'background-image': 'url(' + imageURL + ')' }">
      <template v-if="!imageURL">
        or click here and paste screenshot to automatically fill in the numbers
      </template>
    </div>
    <div v-if="parseFail">
      Failed to extract numbers from screenshot.
      <br>
      Please only include the empty tower puzzle in the screenshot as shown the image below
      <br>
      <img src="static/sample screenshot.png" width="150px" height="150px">
    </div>
    <table>
      <tr>
        <td></td>
        <td v-for="(_, n) in boardSize">
          <input type="number" min="1" max="5" v-model="sides[n + 2 * boardSize]" number>
        </td>
        <td></td>
      </tr>
      <tr v-for="(_, n) in boardSize">
        <td><input type="number" min="1" max="5" v-model="sides[n]" number></td>
        <td v-for="(_, m) in boardSize">{{ selectedSolution[n][m] }}</td>
        <td><input type="number" min="1" max="5" v-model="sides[n + boardSize]" number></td>
      </tr>
      <tr>
        <td></td>
        <td v-for="(_, n) in boardSize"><input type="number" min="1" max="5" v-model="sides[n + 3 * boardSize]" number>
        </td>
        <td></td>
      </tr>
    </table>
    <div v-if="towerSolutionsList.length == 0">
      No solutions for the given inputs, please check for typos
    </div>
    <template v-if="towerSolutionsList.length > 1">
      <select v-model="solutionIndex">
        <option v-for="solution in towerSolutionsList" :value="solution">Solution {{ solution + 1 }}</option>
      </select>
      <br>This puzzle has multiple solutions
    </template>
    <br><br>
  </div>
  <div align="center" v-else>
    Page may take several seconds on first load as it calculates the possible tower puzzle solutions.<br>
    Load times should be faster when revisiting the page.
  </div>
</template>

<script>

  export default {
    name: 'HelloWorld',
    data() {
      return {
        sides: [2, 2, 2, 1, 3, 2, 2, 3, 3, 1, 2, 2, 2, 1, 3, 2, 2, 3, 3, 1],
        boardSize: 5,
        towersList: {},
        row: [],
        loaded: false,
        solutionIndex: 0,
        image: null,
        imageURL: null,
        parseFail: false
      }
    },
    methods: {
      pasteHandler(e) {
        const item = e.clipboardData.items[0];
        if (item.type.indexOf('image') >= 0) {
          this.image = item.getAsFile();
          const reader = new FileReader();
          reader.addEventListener('load', () => {
            this.imageURL = reader.result;
          }, false);
          reader.readAsDataURL(this.image);

          Tesseract.recognize(this.image, {
            tessedit_char_whitelist: '12345'
          }).then((result) => {
            const numbers = result.text.match(/[1-5]/g);
            if (numbers && numbers.length === 20) {
              this.sides = [numbers[5], numbers[7], numbers[9], numbers[11], numbers[13],
                numbers[6], numbers[8], numbers[10], numbers[12], numbers[14],
                ...numbers.slice(0, 5), ...numbers.slice(15, 20)];
              this.parseFail = false;
            } else {
              this.parseFail = true;
            }
          })
        }
      },
      generateBoard(row, n) {
        if (n === 1) {
          return row.map(p => [p]);
        } else {
          const boardNminus1 = this.generateBoard(row, n - 1);
          const result = [];
          boardNminus1.forEach((board) => {
            row.forEach((row) => {
              const validBoard = [0, 1, 2, 3, 4].every((n) => {
                return board.every((r) => r[n] !== row[n]);
              });
              if (validBoard) {
                const newArr = board.slice();
                newArr.push(row);
                result.push(newArr);
              }
            });
          });
          return result;
        }
      },
      pN(n) {
        if (n === 1) {
          return [[1]];
        } else {
          const pNminus1 = this.pN(n - 1);
          const result = [];
          pNminus1.forEach((r) => {
            for (let i = 0; i < n; i++) {
              const newArr = r.slice();
              newArr.splice(i, 0, n);
              result.push(newArr);
            }
          });
          return result;
        }
      },
      towerCount(row) {
        let maxHeight = 0;
        let count = 0;
        for (let i = 0; i < row.length; i++) {
          if (row[i] > maxHeight) {
            maxHeight = row[i];
            count++;
          }
        }
        return count;
      },
      towers(boards) {
        return boards.reduce((acc, b) => {
          const key = [...b.map(this.towerCount), ...b.map((r) => this.towerCount(r.slice().reverse())),
            ...this.transpose(b).map(this.towerCount), ...this.transpose(b).map((r) => this.towerCount(r.slice().reverse()))].join("");
          if (!acc.hasOwnProperty(key)) {
            acc[key] = [];
          }
          acc[key].push(b);
          return acc;
        }, {});
      },
      transpose(a) {
        return a[0].map((_, c) => a.map(r => r[c]));
      }
    },
    computed: {
      towerSolution() {
        return this.towersList[this.sides.join("")];
      },
      towerSolutionsList() {
        return this.towerSolution ? [...new Array(this.towerSolution.length).keys()] : [];
      },
      selectedSolution() {
        return this.towerSolution ? this.towerSolution[this.solutionIndex].map((i) => this.row[i]) : [[], [], [], [], []];
      }
    },
    mounted() {
      setTimeout(() => {
        this.row = this.pN(this.boardSize);
        // for efficiency to not recalculate all boards each refresh, store the boards in localstorage
        // due to size limitations in localstorage, we compress each board into a list of row indices
        // and encode the board lookup keys in a higher radix to reduce the storage size to ~4 MB
        if (localStorage && localStorage.hasOwnProperty("towers")) {
          this.towersList = Object.entries(JSON.parse(localStorage.getItem("towers"))).reduce((acc, [k, v]) => {
            acc[parseInt(k, 36).toString(6)] = v;
            return acc;
          }, {});
        } else {
          const towers = this.towers(this.generateBoard(this.row, this.boardSize));
          const rowLookup = {};
          for (let i = 0; i < this.row.length; i++) {
            rowLookup[this.row[i].join("")] = i;
          }
          this.towersList = Object.entries(towers).reduce((acc, [k, v]) => {
            acc[k] = v.map((b) => b.map((r) => rowLookup[r.join("")]));
            return acc;
          }, {});
          try {
            localStorage.clear();
            localStorage.setItem("towers", JSON.stringify(Object.entries(towers).reduce((acc, [k, v]) => {
              acc[parseInt(k, 6).toString(36)] = v.map((b) => b.map((r) => rowLookup[r.join("")]));
              return acc;
            }, {})));
          }
          catch (error) {
            console.log(error);
          }
        }
        this.loaded = true;
      }, 0);
    },
    watch: {
      towerSolutionsList: function (newList) {
        this.solutionIndex = newList[0];
      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  table {
    border-collapse: collapse;
  }

  td:first-child, td:last-child, tr:first-child > td, tr:last-child > td {
    border: none;
  }

  td {
    padding: 0;
    border: 1px solid black;
    width: 30px;
    height: 30px;
    text-align: center;
  }

  input {
    width: 25px;
    height: 25px;
    border: none;
    margin: 0 auto;
    text-align: center;
  }

  .pasteBox {
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    height: 200px;
    width: 400px;
  }
</style>
