import logo from './logo.svg';
import styles from './App.module.css';
import { searchPlayer, singleSolution } from './game/search.js';
import { checkPlayerTeams, createGame, randomTeams } from './game/teams.js';
import { batch, createSignal, Show } from "solid-js";

function App() {
  const length = 3;
  const maxScore = length * length;
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
  const [score, setScore] = createSignal(0);
  const [searchResult, setSearchResult] = createSignal([]);

  const checkResult = function (item) {
    for (const e of Object.entries(board)) {
      const [teams, answer] = e;
      console.log(answer);
      if (checkPlayerTeams(teams.split(','), item.teams) && answer.player == null) {
        const [row, col] = answer.coordinates;
        console.log(answer);
        board[teams].player = item.name
        showGrid[row + 1][col + 1] = item.imageUrl;
        const newGrid = new Array(length + 1);
        for (var i = 0; i < showGrid.length; i++) {
          newGrid[i] = [];
          for (var j = 0; j < showGrid.length; j++)
            newGrid[i][j] = showGrid[i][j];
        }
        setGridSignal(newGrid);
        console.log("Correct");
        console.log(board);
        setScore(score() + 1);
        if (score() == maxScore) alert("You Win!");
        break;
      }
    }
  }

  const submit = (event) => {
    event.preventDefault();
    batch(() => {
      setPlayer(inputField());
      console.log(player());
      searchPlayer(player().toLowerCase()).then(function (result) {
        if (result == null) {
          alert("bad input");
        } else if (result.length > 1) {
          setSearchResult(result);
        } else {
          console.log(result[0].teams);
          checkResult(result[0]);
        }
      });
      setInputField("");
    });
  };

  const hint = (event) => {
    event.preventDefault();
    batch(() => {
      for (const e of Object.entries(board)) {
        const [teams, answer] = e;
        if (answer.player == null) {
          singleSolution(teams.split(','), false, true).then(function (result) {
            alert(result);
          });
          break;
        }
      };
    });
  }

  console.log(gridSignal());
  return (
    <div>
      <table>
        <tbody>
          <For each={gridSignal()}>{teams =>
            <tr><For each={teams}>{item =>
              <Show
                when={item != null}
                fallback={<td><spacer width="125px" height="125px" /></td>}
              >
                <Show
                  when={item.length > 3}
                  fallback={
                    <td><img src={`/team-logos/${item}.png`} width="125px" height="125px" /></td>
                  }>
                  <td><img src={item} width="125px" height="125px" /></td>
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
      <button onClick={() => console.log("F")}>Solve</button>
      <button onClick={hint}>Hint</button>
      <ul>
        <Show
          when={searchResult().length >= 2}
        >
          <For each={searchResult()}>{item =>
            <li>
              <img src={item.imageUrl} />{item.name}: {item.years.start}-{item.years.end}
              <button onClick={() => { checkResult(item); }}>Select</button>
            </li>
          }</For>
        </Show>
      </ul>
    </div>
  );
}
export default App;
