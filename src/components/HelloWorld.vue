<template>
  <div align="center">
    <table>
      <tr>
        <td></td>
        <td><input type="number" min="1" max="5" v-model="sides[10]" number></td>
        <td><input type="number" min="1" max="5" v-model="sides[11]" number></td>
        <td><input type="number" min="1" max="5" v-model="sides[12]" number></td>
        <td><input type="number" min="1" max="5" v-model="sides[13]" number></td>
        <td><input type="number" min="1" max="5" v-model="sides[14]" number></td>
        <td></td>
      </tr>
      <tr>
        <td><input type="number" min="1" max="5" v-model="sides[0]" number></td>
        <td>{{ selectedSolution[0][0] }}</td>
        <td>{{ selectedSolution[0][1] }}</td>
        <td>{{ selectedSolution[0][2] }}</td>
        <td>{{ selectedSolution[0][3] }}</td>
        <td>{{ selectedSolution[0][4] }}</td>
        <td><input type="number" min="1" max="5" v-model="sides[5]" number></td>
      </tr>
      <tr>
        <td><input type="number" min="1" max="5" v-model="sides[1]" number></td>
        <td>{{ selectedSolution[1][0] }}</td>
        <td>{{ selectedSolution[1][1] }}</td>
        <td>{{ selectedSolution[1][2] }}</td>
        <td>{{ selectedSolution[1][3] }}</td>
        <td>{{ selectedSolution[1][4] }}</td>
        <td><input type="number" min="1" max="5" v-model="sides[6]" number></td>
      </tr>
      <tr>
        <td><input type="number" min="1" max="5" v-model="sides[2]" number></td>
        <td>{{ selectedSolution[2][0] }}</td>
        <td>{{ selectedSolution[2][1] }}</td>
        <td>{{ selectedSolution[2][2] }}</td>
        <td>{{ selectedSolution[2][3] }}</td>
        <td>{{ selectedSolution[2][4] }}</td>
        <td><input type="number" min="1" max="5" v-model="sides[7]" number></td>
      </tr>
      <tr>
        <td><input type="number" min="1" max="5" v-model="sides[3]" number></td>
        <td>{{ selectedSolution[3][0] }}</td>
        <td>{{ selectedSolution[3][1] }}</td>
        <td>{{ selectedSolution[3][2] }}</td>
        <td>{{ selectedSolution[3][3] }}</td>
        <td>{{ selectedSolution[3][4] }}</td>
        <td><input type="number" min="1" max="5" v-model="sides[8]" number></td>
      </tr>
      <tr>
        <td><input type="number" min="1" max="5" v-model="sides[4]" number></td>
        <td>{{ selectedSolution[4][0] }}</td>
        <td>{{ selectedSolution[4][1] }}</td>
        <td>{{ selectedSolution[4][2] }}</td>
        <td>{{ selectedSolution[4][3] }}</td>
        <td>{{ selectedSolution[4][4] }}</td>
        <td><input type="number" min="1" max="5" v-model="sides[9]" number></td>
      </tr>
      <tr>
        <td></td>
        <td><input type="number" min="1" max="5" v-model="sides[15]" number></td>
        <td><input type="number" min="1" max="5" v-model="sides[16]" number></td>
        <td><input type="number" min="1" max="5" v-model="sides[17]" number></td>
        <td><input type="number" min="1" max="5" v-model="sides[18]" number></td>
        <td><input type="number" min="1" max="5" v-model="sides[19]" number></td>
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
</template>

<script>
  export default {
    name: 'HelloWorld',
    data() {
      return {
        sides: [3, 3, 1, 2, 2, 2, 1, 4, 4, 2, 3, 3, 1, 3, 2, 2, 2, 3, 1, 2],
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
      board() {
        const row = this.pN(5);

        return this.generateBoard(row, 5);
      },
      towers() {
        return this.board.reduce((acc, b) => {
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
