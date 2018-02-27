<template>
  <div align="center" v-if="loaded">
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
    <select v-model="solutionIndex" v-if="towerSolutionsList.length > 1">
      <option v-for="solution in towerSolutionsList" :value="solution">Solution {{ solution + 1 }}</option>
    </select>
  </div>
  <div align="center" v-else>
    Page may take several seconds to load as it calculates the possible tower puzzle solutions.<br>
    Solutions should update instantly after the page is loaded.
  </div>
</template>

<script>
  export default {
    name: 'HelloWorld',
    data() {
      return {
        sides: [3, 3, 1, 2, 2, 2, 1, 4, 4, 2, 3, 3, 1, 3, 2, 2, 2, 3, 1, 2],
        boardSize: 5,
        boards: [],
        loaded: false,
        solutionIndex: 0
      }
    },
    methods: {
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
      transpose(a) {
        return a[0].map((_, c) => a.map(r => r[c]));
      }
    },
    computed: {
      towers() {
        return this.boards.reduce((acc, b) => {
          const key = [...b.map(this.towerCount), ...b.map((r) => this.towerCount(r.slice().reverse())),
            ...this.transpose(b).map(this.towerCount), ...this.transpose(b).map((r) => this.towerCount(r.slice().reverse()))].join("");
          if (!acc.hasOwnProperty(key)) {
            acc[key] = [];
          }
          acc[key].push(b);
          return acc;
        }, {});
      },
      towerSolution() {
        return this.towers[this.sides.join("")];
      },
      towerSolutionsList() {
        return this.towerSolution ? [...new Array(this.towerSolution.length).keys()] : [];
      },
      selectedSolution() {
        return this.towerSolution ? this.towerSolution[this.solutionIndex] : [[], [], [], [], []];
      }
    },
    mounted() {
      setTimeout(() => {
        const row = this.pN(this.boardSize);
        this.boards = this.generateBoard(row, this.boardSize);
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
</style>
