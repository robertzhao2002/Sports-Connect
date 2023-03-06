import logo from './logo.svg';
import styles from './App.module.css';
import { searchPlayer } from './game/search.js';
import { checkPlayerTeams, createGame, randomTeams } from './game/teams.js';
import { batch, createSignal, createEffect, Show } from "solid-js";

function createGrid(sideLength) {
  const result = [];
  for (var i = 0; i < sideLength; i++) {
    result[i] = new Array(sideLength);
  }
  return result;
}


function App() {
  const length = 3;
  const teams = randomTeams(length * 2);
  const board = createGame(teams);
  const showGrid = new Array(length + 1);
  for (var i = 1; i < showGrid.length; i++) {
    showGrid[i] = [teams[i - 1]].concat(Array(length).fill(null));
  }
  showGrid[0] = [null].concat(teams.slice(length, 2 * length));
  const [inputField, setInputField] = createSignal("");
  const [player, setPlayer] = createSignal("");
  const [gridSignal, setGridSignal] = createSignal(showGrid);
  const submit = (event) => {
    event.preventDefault();
    batch(() => {
      setPlayer(inputField());
      console.log(player());
      searchPlayer(player()).then(function (result) {
        if (result == null) {
          console.log("bad input");
        } else if (result.length > 1) {

        } else {
          Object.entries(board).forEach((e) => {
            const [teams, answer] = e;
            if (checkPlayerTeams(teams.split(','), result[0].teams)) {
              const [row, col] = answer.coordinates;
              board[teams] = result[0].name
              showGrid[row + 1][col + 1] = result[0].imageUrl;
              setGridSignal(showGrid);
              console.log("Correct");
              console.log(board);
            }
          })
        }
      });
      setInputField("");
    });
  };
  console.log(gridSignal());
  return (
    <div>
      <table>
        <tbody>
          <For each={gridSignal()}>{teams =>
            <tr><For each={teams}>{item =>
              <Show
                when={item != null}
                fallback={<td><spacer width="125" height="125" /></td>}
              >
                <Show
                  when={item.length > 3}
                  fallback={
                    <img src={`/team-logos/${item}.png`} />
                  }>
                  <img src={item} />
                </Show>
              </Show>
            }</For></tr>
          }</For>
        </tbody>
      </table>
      <form onSubmit={submit}>
        <input
          placeholder='Michael Harris'
          value={inputField()}
          onInput={(e) => setInputField(e.currentTarget.value)}
          required
        />
        <button type="submit">Check</button>
      </form>

    </div>
  );
}
export default App;
