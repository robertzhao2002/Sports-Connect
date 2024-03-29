import '../index.css';
import { possibleSolution, searchPlayer, getHint, getSportValue } from './search.js';
import { checkPlayerTeams, getMatrix, randomTeams } from './teams.js';
import { batch, createSignal, Show } from "solid-js";
import { pastGuesses, setPastGuesses } from './History';
import { setCustomGameState, CurrentCustomGameState, resetCustomGame } from './Custom';

export const [numCorrect, setNumCorrect] = createSignal(0);

export function createGrid(rowTeams, colTeams) {
    const showGrid = new Array(rowTeams.length + 1);
    for (var i = 1; i < showGrid.length; i++) {
        showGrid[i] = [rowTeams[i - 1]].concat(Array(length).fill(null));
    }
    showGrid[0] = [null].concat(colTeams);
    return showGrid;
}

function createGame(rowTeams, colTeams) {
    return {
        score: 0,
        board: getMatrix(rowTeams, colTeams),
        grid: createGrid(rowTeams, colTeams),
        solution: null
    };
}

function createRandomGame(mode, length) {
    const teams = randomTeams(length * 2, mode);
    return createGame(teams.slice(0, length), teams.slice(length, teams.length));
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

export function ConnectGame(mode, length, customTeams = null, customMode = false) {
    console.log(mode);
    const maxScore = (customTeams == null) ? length * length : customTeams[0].length * customTeams[1].length;
    const game = (customTeams == null) ? createRandomGame(mode, length) : createGame(customTeams[0], customTeams[1]);
    const [gameSignal, setGameSignal] = createSignal(game);
    const [inputField, setInputField] = createSignal("");
    const [player, setPlayer] = createSignal("");
    const [searchResult, setSearchResult] = createSignal([]);
    const [isLoading, setIsLoading] = createSignal(false);

    const checkResult = function (item) {
        const wrong = { league: mode, correct: false };
        const correct = { league: mode, correct: true, correctTeams: null };
        for (const e of Object.entries(gameSignal().board)) {
            const [teams, answer] = e;
            const teamList = teams.split(',');
            console.log(answer);
            if (checkPlayerTeams(teamList, item.teams, mode) && answer.player == null) {
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
            setIsLoading(true);
            setPlayer(inputField());
            console.log(player());
            searchPlayer(player().toLowerCase(), mode, true).then(function (result) {
                setIsLoading(false);
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
            if (customMode) {
                setCustomGameState({ state: CurrentCustomGameState.Loading });
                resetCustomGame();
            } else {
                setGameSignal(createRandomGame(mode, length));
            }
        });
    }

    const hint = (event) => {
        event.preventDefault();
        batch(() => {
            setIsLoading(true);
            for (const e of Object.entries(gameSignal().board)) {
                const [teams, answer] = e;
                if (answer.player == null) {
                    getHint(teams.split(','), true, mode).then(function (result) {
                        setIsLoading(false);
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
            setIsLoading(true);
            possibleSolution(Object.keys(gameSignal().board), mode).then(function (result) {
                setIsLoading(false);
                console.log(result);
                gameSignal().solution = result;
                setGameSignal(gameCopy(gameSignal()));
            });
        });
    }
    return (
        <div align="center" style="position: relative">
            <Show
                when={isLoading()}>
                <div class="loaderWheel" />
            </Show>
            <div class={(isLoading()) ? "disabledComponent" : ""}>
                <Show
                    when={gameSignal().score == maxScore}>
                    <h1>You Win!</h1>
                </Show>
                <Show
                    when={gameSignal().solution != null}>
                    <h1 style="margin-left: 50px">Possible Solutions</h1>
                    <div class="solutionPairContainer scrollMenu">
                        <For each={Object.keys(gameSignal().board)}>{teams =>
                            <div class="solutionPair">
                                <img src={`/team-logos/${mode}/${teams.split(',')[0]}.png`} height="50" width="50" />
                                <img src={`/team-logos/${mode}/${teams.split(',')[1]}.png`} height="50" width="50" />

                                <Show
                                    when={mode == "mlb"}>
                                    <h1>Hitters</h1>
                                    <span>
                                        <For each={Array.from(gameSignal().solution[teams].hitters)}>{solutionString => {
                                            const [name, url] = solutionString.split('..');
                                            return (<a href={url} target="_blank" class="buttonLink">{name}</a>);
                                        }}
                                        </For>
                                    </span>
                                    <br />
                                    <h1>Pitchers</h1>
                                    <span>
                                        <For each={Array.from(gameSignal().solution[teams].pitchers)}>{solutionString => {
                                            const [name, url] = solutionString.split('..');
                                            return (<a href={url} target="_blank" class="buttonLink">{name}</a>);
                                        }}
                                        </For>
                                    </span>
                                    <br />
                                </Show>
                                <Show
                                    when={mode == "nba"}>
                                    <span>
                                        <For each={Array.from(gameSignal().solution[teams])}>{solutionString => {
                                            const [name, url] = solutionString.split('..');
                                            return (<a href={url} target="_blank" class="buttonLink">{name}</a>);
                                        }}
                                        </For>
                                    </span>
                                    <br />
                                </Show>
                            </div>
                        }
                        </For>

                    </div>
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
                                                <td><img src={`/team-logos/${mode}/${item}.png`} width="75px" height="75px" /></td>
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
                                placeholder={getSportValue(mode, {
                                    mlb: 'Derek Jeter',
                                    nba: 'Kobe Bryant',
                                    nfl: 'Calvin Johnson'
                                })}
                                value={inputField()}
                                onInput={(e) => setInputField(e.currentTarget.value)}
                                required
                            />
                            <br />
                            <button type="submit" class="checkButton">Check 🔍</button>
                        </form>
                    </Show>
                    <button onClick={newGame} id="newGame">New {(customMode) ? "Custom Game " : ""}🔀</button>
                    <Show
                        when={(mode == 'mlb' || mode == 'nba') && gameSignal().solution == null && gameSignal().score != maxScore}>

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
        </div>
    );
}