import logo from './logo.svg';
import styles from './App.module.css';
import { searchPlayer } from './game/search.js';
import { randomTeams, createGame } from './game/teams.js';
import { createSignal } from "solid-js";

function createGrid(sideLength) {
  const result = [];
  for (var i = 0; i < sideLength; i++) {
    result[i] = new Array(sideLength);
  }
  return result;
}


function App() {
  const [url, setUrl] = createSignal('loading ...');
  const length = 3;
  const teams = randomTeams(length * 2);
  const board = createGame(teams);
  const showGrid = createGrid(length);
  const rowTeams = teams.slice(0, length);
  const colTeams = teams.slice(length, 2 * length);
  console.log(teams);
  Object.entries(board).forEach(e => {
    console.log(e);
  })
  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td><spacer width="125" height="125" /></td>
            <For each={colTeams}>{team =>
              <img src={`/team-logos/${team}.png`} />
            }</For>
          </tr>
          <For each={rowTeams}>{team =>
            <tr><td><img src={`/team-logos/${team}.png`} /></td></tr>
          }</For>
        </tbody>
      </table>
      <input />
      <button>Check</button>
    </div>
  );
}
export default App;
