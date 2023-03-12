import '../index.css';
import { possibleSolution, searchPlayer, singleSolution } from './search.js';
import { checkPlayerTeams, getMatrix, randomTeams } from './teams.js';
import { batch, createSignal, Show } from "solid-js";

export const [pastGuesses, setPastGuesses] = createSignal([]);
const [numCorrect, setNumCorrect] = createSignal(0);
function createGrid(teams, length) {
    const showGrid = new Array(length + 1);
    for (var i = 1; i < showGrid.length; i++) {
        showGrid[i] = [teams[i - 1]].concat(Array(length).fill(null));
    }
    showGrid[0] = [null].concat(teams.slice(length, 2 * length));
    return showGrid;
}

function createGame(MLB, length) {
    const teams = randomTeams(length * 2, MLB);
    return {
        score: 0,
        board: getMatrix(teams),
        grid: createGrid(teams, length),
        solution: null
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

function solutionCopy(s) {
    const copy = Object.assign(s);
    return copy;
}

function gameCopy(g) {
    return {
        score: g.score,
        board: boardCopy(g.board),
        grid: gridCopy(g.grid),
        solution: (g.solution == null) ? null : solutionCopy(g.solution)
    };
}

export function PastGuesses() {
    return (<div align="center">
        <h1>
            Past Guesses {
                (pastGuesses().length > 0 ? `: ${numCorrect()}/${pastGuesses().length} (${(numCorrect() / pastGuesses().length * 100).toFixed(2)}%)` : '')
            }
        </h1>
        <table id="pastGuesses">
            <tbody>
                <For each={pastGuesses()}>{item =>
                    <tr>
                        <td><img height="100" width="100" src={item.imageUrl} /></td>
                        <td>
                            <p>{item.name}</p>
                            <p>{item.years.start}-{item.years.end}</p>
                            <img src={`/pictures/${item.league}.png`} height="25" width="25" />
                        </td>
                        <td>
                            <For each={Object.entries(item.teams)}>{ty =>
                                <div class="pastGuessesCol">
                                    <img src={`/team-logos/${item.league}/${ty[0]}.png`} height="25" width="25" />
                                    <For each={ty[1]}>{yr =>
                                        <Show
                                            when={yr.end - yr.start > 0}
                                            fallback={<span>({yr.start})</span>}>
                                            <span>({yr.start}-{yr.end})</span>
                                        </Show>
                                    }</For>
                                </div>
                            }
                            </For>
                        </td>
                        <Show
                            when={item.correct == true}
                            fallback={<td><img src="/pictures/wrong.png" width="50px" height="50px" /></td>}>
                            <td>
                                <div class="pastGuessesCol">
                                    <img src="/pictures/correct.png" width="50px" height="50px" />
                                    <img src={`/team-logos/${item.league}/${item.correctTeams[0]}.png`} height="25" width="25" />
                                    <span>⇔</span>
                                    <img src={`/team-logos/${item.league}/${item.correctTeams[1]}.png`} height="25" width="25" />
                                </div>
                            </td>
                        </Show>

                    </tr>
                }
                </For>
            </tbody>
        </table>
    </div>);
}

export function ConnectGame(MLB, length) {
    const maxScore = length * length;
    const game = createGame(MLB, length);
    const [gameSignal, setGameSignal] = createSignal(game);
    const [inputField, setInputField] = createSignal("");
    const [player, setPlayer] = createSignal("");
    const [searchResult, setSearchResult] = createSignal([]);
    const leagueString = (MLB) ? "mlb" : "nba";

    const checkResult = function (item) {
        const wrong = { league: leagueString, correct: false };
        const correct = { league: leagueString, correct: true, correctTeams: null };
        for (const e of Object.entries(gameSignal().board)) {
            const [teams, answer] = e;
            const teamList = teams.split(',');
            console.log(answer);
            if (checkPlayerTeams(teamList, item.teams, MLB) && answer.player == null) {
                const [row, col] = answer.coordinates;
                console.log(answer);
                gameSignal().board[teams].player = item.name
                gameSignal().grid[row + 1][col + 1] = item.imageUrl;
                gameSignal().score = gameSignal().score + 1;
                setGameSignal(gameCopy(gameSignal()));
                console.log("Correct");
                setNumCorrect(numCorrect() + 1);
                console.log(gameSignal());
                const guessSuccess = Object.assign(correct, item);
                guessSuccess.correctTeams = teamList;
                const newResult = [guessSuccess, ...pastGuesses()];
                setPastGuesses(newResult);
                return;
            }
        }
        const newResult = [Object.assign(wrong, item), ...pastGuesses()];
        setPastGuesses(newResult);

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

    const newGame = (event) => {
        event.preventDefault();
        batch(() => {
            setGameSignal(createGame(MLB, length));
        });
    }

    const hint = (event) => {
        event.preventDefault();
        batch(() => {
            for (const e of Object.entries(gameSignal().board)) {
                const [teams, answer] = e;
                if (answer.player == null) {
                    singleSolution(teams.split(','), false, true).then(function (result) {
                        alert(result.split('..')[0]);
                    });
                    break;
                }
            };
        });
    }

    const solve = (event) => {
        event.preventDefault();
        batch(() => {
            console.log("solving...");
            possibleSolution(Object.keys(gameSignal().board)).then(function (result) {
                console.log(result);
                gameSignal().solution = result;
                setGameSignal(gameCopy(gameSignal()));
            });
        });
    }
    return (
        <div align="center">
            <Show
                when={gameSignal().score == maxScore}>
                <h1>You Win!</h1>
            </Show>
            <Show
                when={gameSignal().solution != null}>
                <For each={Object.keys(gameSignal().board)}>{teams =>
                    <div>
                        <img src={`/team-logos/${leagueString}/${teams.split(',')[0]}.png`} height="50" width="50" />
                        <img src={`/team-logos/${leagueString}/${teams.split(',')[1]}.png`} height="50" width="50" />
                        <span>Hitters:
                            <For each={Array.from(gameSignal().solution[teams].hitters)}>{solutionString => {
                                const [name, url] = solutionString.split('..');
                                return (<a href={url} target="_blank" class="buttonLink">{name}</a>);
                            }}
                            </For>
                        </span>
                        <br />
                        <img src={`/team-logos/${leagueString}/${teams.split(',')[0]}.png`} height="50" width="50" />
                        <img src={`/team-logos/${leagueString}/${teams.split(',')[1]}.png`} height="50" width="50" />
                        <span>Pitchers:
                            <For each={Array.from(gameSignal().solution[teams].pitchers)}>{solutionString => {
                                const [name, url] = solutionString.split('..');
                                return (<a href={url} target="_blank" class="buttonLink">{name}</a>);
                            }}
                            </For>
                        </span>
                        <br />
                    </div>
                }
                </For>
            </Show>
            <Show when={gameSignal().solution == null}>
                <table>
                    <tbody>
                        <For each={gameSignal().grid}>{teams =>
                            <tr><For each={teams}>{item =>
                                <Show
                                    when={item != null}
                                    fallback={<td><spacer width="75px" height="75px" /></td>}
                                >
                                    <Show
                                        when={item.length > 3}
                                        fallback={
                                            <td><img src={`/team-logos/${(MLB) ? 'mlb' : 'nba'}/${item}.png`} width="75px" height="75px" /></td>
                                        }>
                                        <td><img src={item} width="75px" height="75px" /></td>
                                    </Show>
                                </Show>
                            }</For></tr>
                        }</For>
                    </tbody>
                </table>
            </Show>
            <div class="actions">
                <Show when={gameSignal().solution == null && gameSignal().score != maxScore}>
                    <form onSubmit={submit}>
                        <input
                            placeholder={(MLB) ? 'Derek Jeter' : 'Kobe Bryant'}
                            value={inputField()}
                            onInput={(e) => setInputField(e.currentTarget.value)}
                            required
                        />
                        <br />
                        <button type="submit" class="checkButton">Check 🔍</button>
                    </form>
                </Show>
                <button onClick={newGame} id="newGame">New 🔀</button>
                <Show
                    when={MLB == true && gameSignal().solution == null && gameSignal().score != maxScore}>

                    <button onClick={hint} id="hintButton">Hint 💡</button>
                    <button onClick={solve} id="solveButton">Solve ⭐</button>

                </Show>
            </div>
            <table>
                <tbody>
                    <Show
                        when={searchResult().length >= 2}
                    >
                        <th align="center">Which One?</th>
                        <For each={searchResult()}>{item =>
                            <tr>
                                <td><img height="100" width="100" src={item.imageUrl} /></td>
                                <td>{item.name}: {item.years.start}-{item.years.end}</td>
                                <td><button onClick={() => { checkResult(item); setSearchResult([]); }} id="selectButton">Select</button></td>
                            </tr>
                        }
                        </For>
                    </Show>
                </tbody>
            </table>
        </div >
    );
}