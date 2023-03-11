import styles from './App.module.css';
import { searchPlayer, singleSolution } from './game/search.js';
import { checkPlayerTeams, getMatrix, randomTeams } from './game/teams.js';
import { batch, createSignal, Show } from "solid-js";

const MLB = false;
const length = 1;

function createGrid(teams) {
  const showGrid = new Array(length + 1);
  for (var i = 1; i < showGrid.length; i++) {
    showGrid[i] = [teams[i - 1]].concat(Array(length).fill(null));
  }
  showGrid[0] = [null].concat(teams.slice(length, 2 * length));
  return showGrid;
}

function createGame() {
  const teams = randomTeams(length * 2, MLB);
  return {
    score: 0,
    board: getMatrix(teams),
    grid: createGrid(teams),
  };
}

function boardCopy(b) {
  const result = {};
  for (const e of Object.keys(b)) {
    result[e] = b[e];
  }
  return result;
}

function gridCopy(g) {
  const result = new Array(g.length);
  for (var i = 0; i < g.length; i++) {
    result[i] = new Array(g[i].length);
    for (var j = 0; j < g[i].length; j++) {
      result[i][j] = g[i][j];
    }
  }
  return result;
}

function gameCopy(g) {
  return {
    score: g.score,
    board: boardCopy(g.board),
    grid: gridCopy(g.grid)
  };
}

function App() {
  const maxScore = length * length;
  const game = createGame();
  const [gameSignal, setGameSignal] = createSignal(game);
  const [inputField, setInputField] = createSignal("");
  const [player, setPlayer] = createSignal("");
  const [searchResult, setSearchResult] = createSignal([]);
  const [pastGuesses, setPastGuesses] = createSignal([]);

  const checkResult = function (item) {
    const wrong = { correct: false };
    const correct = { correct: true, correctTeams: null };
    for (const e of Object.entries(gameSignal().board)) {
      const [teams, answer] = e;
      console.log(answer);
      if (checkPlayerTeams(teams.split(','), item.teams) && answer.player == null) {
        const [row, col] = answer.coordinates;
        console.log(answer);
        gameSignal().board[teams].player = item.name
        gameSignal().grid[row + 1][col + 1] = item.imageUrl;
        gameSignal().score++;
        setGameSignal(gameCopy(gameSignal()));
        console.log("Correct");
        console.log(gameSignal());
        const guessSuccess = Object.assign(correct, item);
        guessSuccess.correctTeams = teams.split(',');
        const newResult = [guessSuccess, ...pastGuesses()];
        setPastGuesses(newResult);
        break;
      } else {
        const newResult = [Object.assign(wrong, item), ...pastGuesses()];
        setPastGuesses(newResult);
      }
    }

  }

  const submit = (event) => {
    event.preventDefault();
    batch(() => {
      setPlayer(inputField());
      console.log(player());
      searchPlayer(player().toLowerCase(), MLB, true).then(function (result) {
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
      for (const e of Object.entries(gameSignal().board)) {
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

  const restart = (event) => {
    event.preventDefault();
    batch(() => {
      console.log("restarting...");
      setGameSignal(createGame());
    });
  }
  return (
    <div align="center">
      <Show
        when={gameSignal().score == maxScore}>
        <h1>You Win!</h1>
      </Show>
      <h1>Connect the teams by naming a player that played for both teams!</h1>
      <table>
        <tbody>
          <For each={gameSignal().grid}>{teams =>
            <tr><For each={teams}>{item =>
              <Show
                when={item != null}
                fallback={<td><spacer width="125px" height="125px" /></td>}
              >
                <Show
                  when={item.length > 3}
                  fallback={
                    <td><img src={`/team-logos/${(MLB) ? 'mlb' : 'nba'}/${item}.png`} width="125px" height="125px" /></td>
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
          placeholder={(MLB) ? 'Michael Harris' : 'Quinndary Weatherspoon'}
          value={inputField()}
          onInput={(e) => setInputField(e.currentTarget.value)}
          required
        />
        <button type="submit">Check</button>
      </form>
      <br />
      <br />
      <div>
        <h2>Before you start, you need to activate a CORS Proxy to query Sports Reference</h2>
        <a href="https://cors-anywhere.herokuapp.com" target="_blank">Activate CORS Proxy</a>
      </div>

      <br />
      <br />
      <button onClick={restart}>Restart</button>

      <br />
      <br />
      <button onClick={hint}>Hint</button>

      <br>
      </br>
      <button onClick={() => console.log("F")}>Solve</button>

      <table>
        <tbody>
          <Show
            when={searchResult().length >= 2}
          >
            <th>Which One?</th>
            <For each={searchResult()}>{item =>
              <tr>
                <td><img height="100" width="100" src={item.imageUrl} /></td>
                <td>{item.name}: {item.years.start} to {item.years.end}</td>
                <td><button onClick={() => { checkResult(item); setSearchResult([]); }}>Select</button></td>
              </tr>
            }
            </For>
          </Show>
        </tbody>
      </table>
      <h1>Past Guesses</h1>
      <table>
        <tbody>
          <For each={pastGuesses()}>{item =>
            <tr>
              <td><img height="100" width="100" src={item.imageUrl} /></td>
              <td><p>{item.name}: {item.years.start}-{item.years.end}</p></td>
              <td>
                <ul>
                  <For each={Object.entries(item.teams)}>{ty =>
                    <li>{ty[0]}:
                      <For each={ty[1]}>{yr =>
                        <Show
                          when={yr.end - yr.start > 0}
                          fallback={<span> ({yr.start})</span>}>
                          <span> ({yr.start} to {yr.end})</span>
                        </Show>
                      }</For>
                    </li>
                  }
                  </For>
                </ul>
              </td>
              <Show
                when={item.correct == true}
                fallback={<td><img src="/pictures/wrong.png" width="50px" height="50px" /></td>}>
                <td><img src="/pictures/correct.png" width="50px" height="50px" /></td>
                <td><span>{item.correctTeams[0]}&{item.correctTeams[1]}</span></td>
              </Show>
            </tr>
          }
          </For>
        </tbody>

      </table>
    </div >
  );
}
export default App;
