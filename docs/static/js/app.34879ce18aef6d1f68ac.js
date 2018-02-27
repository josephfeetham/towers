webpackJsonp([1],{NHnr:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n("7+uW"),r=n("Gu7T"),i=n.n(r),s={name:"HelloWorld",data:function(){return{sides:[3,3,1,2,2,2,1,4,4,2,3,3,1,3,2,2,2,3,1,2],boardSize:5,boards:[],loaded:!1,solutionIndex:0}},methods:{pN:function(e){if(1===e)return[[1]];var t=[];return this.pN(e-1).forEach(function(n){for(var o=0;o<e;o++){var r=n.slice();r.splice(o,0,e),t.push(r)}}),t},generateBoard:function(e,t){if(1===t)return e.map(function(e){return[e]});var n=[];return this.generateBoard(e,t-1).forEach(function(t){e.forEach(function(e){if([0,1,2,3,4].every(function(n){return t.every(function(t){return t[n]!==e[n]})})){var o=t.slice();o.push(e),n.push(o)}})}),n},towerCount:function(e){for(var t=0,n=0,o=0;o<e.length;o++)e[o]>t&&(t=e[o],n++);return n},transpose:function(e){return e[0].map(function(t,n){return e.map(function(e){return e[n]})})}},computed:{towers:function(){var e=this;return this.boards.reduce(function(t,n){var o=[].concat(i()(n.map(e.towerCount)),i()(n.map(function(t){return e.towerCount(t.slice().reverse())})),i()(e.transpose(n).map(e.towerCount)),i()(e.transpose(n).map(function(t){return e.towerCount(t.slice().reverse())}))).join("");return t.hasOwnProperty(o)||(t[o]=[]),t[o].push(n),t},{})},towerSolution:function(){return this.towers[this.sides.join("")]},towerSolutionsList:function(){return this.towerSolution?[].concat(i()(new Array(this.towerSolution.length).keys())):[]},selectedSolution:function(){return this.towerSolution?this.towerSolution[this.solutionIndex]:[[],[],[],[],[]]}},mounted:function(){var e=this;setTimeout(function(){var t=e.pN(e.boardSize);e.boards=e.generateBoard(t,e.boardSize),e.loaded=!0},0)},watch:{towerSolutionsList:function(e){this.solutionIndex=e[0]}}},a={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return e.loaded?n("div",{attrs:{align:"center"}},[n("table",[n("tr",[n("td"),e._v(" "),e._l(e.boardSize,function(t,o){return n("td",[n("input",{directives:[{name:"model",rawName:"v-model",value:e.sides[o+2*e.boardSize],expression:"sides[n + 2 * boardSize]"}],attrs:{type:"number",min:"1",max:"5",number:""},domProps:{value:e.sides[o+2*e.boardSize]},on:{input:function(t){t.target.composing||e.$set(e.sides,o+2*e.boardSize,t.target.value)}}})])}),e._v(" "),n("td")],2),e._v(" "),e._l(e.boardSize,function(t,o){return n("tr",[n("td",[n("input",{directives:[{name:"model",rawName:"v-model",value:e.sides[o],expression:"sides[n]"}],attrs:{type:"number",min:"1",max:"5",number:""},domProps:{value:e.sides[o]},on:{input:function(t){t.target.composing||e.$set(e.sides,o,t.target.value)}}})]),e._v(" "),e._l(e.boardSize,function(t,r){return n("td",[e._v(e._s(e.selectedSolution[o][r]))])}),e._v(" "),n("td",[n("input",{directives:[{name:"model",rawName:"v-model",value:e.sides[o+e.boardSize],expression:"sides[n + boardSize]"}],attrs:{type:"number",min:"1",max:"5",number:""},domProps:{value:e.sides[o+e.boardSize]},on:{input:function(t){t.target.composing||e.$set(e.sides,o+e.boardSize,t.target.value)}}})])],2)}),e._v(" "),n("tr",[n("td"),e._v(" "),e._l(e.boardSize,function(t,o){return n("td",[n("input",{directives:[{name:"model",rawName:"v-model",value:e.sides[o+3*e.boardSize],expression:"sides[n + 3 * boardSize]"}],attrs:{type:"number",min:"1",max:"5",number:""},domProps:{value:e.sides[o+3*e.boardSize]},on:{input:function(t){t.target.composing||e.$set(e.sides,o+3*e.boardSize,t.target.value)}}})])}),e._v(" "),n("td")],2)],2),e._v(" "),0==e.towerSolutionsList.length?n("div",[e._v("\n    No solutions for the given inputs, please check for typos\n  ")]):e._e(),e._v(" "),e.towerSolutionsList.length>1?n("select",{directives:[{name:"model",rawName:"v-model",value:e.solutionIndex,expression:"solutionIndex"}],on:{change:function(t){var n=Array.prototype.filter.call(t.target.options,function(e){return e.selected}).map(function(e){return"_value"in e?e._value:e.value});e.solutionIndex=t.target.multiple?n:n[0]}}},e._l(e.towerSolutionsList,function(t){return n("option",{domProps:{value:t}},[e._v("Solution "+e._s(t+1))])})):e._e()]):n("div",{attrs:{align:"center"}},[e._v("\n  Page may take several seconds to load as it calculates the possible tower puzzle solutions."),n("br"),e._v("\n  Solutions should update instantly after the page is loaded.\n")])},staticRenderFns:[]};var u={name:"App",components:{HelloWorld:n("VU/8")(s,a,!1,function(e){n("wb75")},"data-v-6d5abe46",null).exports}},d={render:function(){var e=this.$createElement,t=this._self._c||e;return t("div",{attrs:{id:"app"}},[this._v("\n  Join "),t("a",{attrs:{href:"http://services.runescape.com/m=clan-home/clan/Soccermoms",target:"_blank"}},[this._v("Soccermoms")]),this._v(" today for clue luck\n  "),t("br"),this._v(" "),t("br"),this._v(" "),t("HelloWorld")],1)},staticRenderFns:[]};var l=n("VU/8")(u,d,!1,function(e){n("WoqL")},null,null).exports;o.a.config.productionTip=!1,new o.a({el:"#app",components:{App:l},template:"<App/>"})},WoqL:function(e,t){},wb75:function(e,t){}},["NHnr"]);
//# sourceMappingURL=app.34879ce18aef6d1f68ac.js.map