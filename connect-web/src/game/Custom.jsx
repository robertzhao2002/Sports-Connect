import '../index.css';
import { MLBTEAMS, NBATEAMS } from './teams';
import { createSignal, Show } from "solid-js";
import { createGrid, ConnectGame } from './Game';

const [teamsSelected, setTeamsSelected] = createSignal([]);
const [rowTeams, setRowTeams] = createSignal([]);
const [colTeams, setColTeams] = createSignal([]);
const [teamsGrid, setTeamsGrid] = createSignal([[]]);
const [sportSignal, setSportSignal] = createSignal("mlb");
const [rowMode, setRowMode] = createSignal(true);
export const [customGameState, setCustomGameState] = createSignal({ state: "CustomLoading" });
export const CurrentCustomGameState = {
    Loading: "CustomLoading",
    Start: "CustomGameStart"
}

function CustomGameStart() {
    const mode = sportSignal() == "mlb";
    return ConnectGame(
        mode,
        Math.floor(teamsSelected().length / 2),
        [rowTeams(), colTeams()],
        true
    );
}

function addTeam(team) {
    if (rowMode()) {
        setRowTeams([...rowTeams(), team]);
    } else {
        setColTeams([...colTeams(), team]);
    }
    console.log("Adding", team);
    setTeamsSelected([...teamsSelected(), team]);
    setTeamsGrid(createGrid(rowTeams(), colTeams()));
}

function Teams(teams, sport) {
    return (<div align="center">
        <For each={teams}>{team =>
            <div class={(teamsSelected().includes(team)) ? "customImg-disabled" : "customImg"}>
                <img src={`/team-logos/${sport}/${team}.png`} height="40px" width="40px" onClick={() =>
                    addTeam(team)} />
            </div>
        }</For>
    </div>);
}

export function resetCustomGame() {
    setTeamsGrid([[]]);
    setTeamsSelected([]);
    setRowMode(true);
    setRowTeams([]);
    setColTeams([]);
}

function changeMode(mode) {
    setSportSignal(mode);
    resetCustomGame();
}

function MLBTeams() {
    return Teams(MLBTEAMS, 'mlb');
}

function NBATeams() {
    return Teams(NBATEAMS, 'nba');
}

function SelectTeams() {
    return (<div align="center">
        <h1>Pick Your Teams!</h1>
        <button style={`background-color: ${(sportSignal() == "mlb") ? "darkorchid" : "beige"}`} onClick={() => changeMode("mlb")}>MLB</button>
        <button style={`background-color: ${(sportSignal() == "nba") ? "darkorchid" : "beige"}`} onClick={() => changeMode("nba")}>NBA</button>
        <Show when={sportSignal() == "mlb"}>
            <MLBTeams />
        </Show>
        <Show when={sportSignal() == "nba"}>
            <NBATeams />
        </Show>
        <div>
            <button style={`background-color: ${(rowMode()) ? "cadetblue" : "beige"}`} onClick={() => setRowMode(true)}>Row Teams</button>
            <button style={`background-color: ${(rowMode()) ? "beige" : "cadetblue"}`} onClick={() => setRowMode(false)}>Column Teams</button>
        </div>
        <Show when={teamsSelected().length >= 1}>
            <button id="resetCustom" onclick={() => resetCustomGame()}>Reset</button>
        </Show>
        <Show when={rowTeams().length >= 1 && colTeams().length >= 1}>
            <button id="startCustom" onclick={() => { setCustomGameState({ state: CurrentCustomGameState.Start }) }}>Start</button>
        </Show>
        <Show when={teamsSelected().length >= 1}>
            <h1>Preview</h1>
            <table>
                <tbody>
                    <For each={teamsGrid()}>{teams =>
                        <tr><For each={teams}>{item =>
                            <Show
                                when={item != null}
                                fallback={<td><spacer width="40px" height="40px" /></td>}
                            >
                                <td><img src={`/team-logos/${sportSignal()}/${item}.png`} width="40px" height="40px" /></td>
                            </Show>
                        }</For></tr>
                    }</For>
                </tbody>
            </table>
        </Show>
    </div>);
}

export function CustomGame() {
    console.log(customGameState());
    return (<div align="center">
        <Show when={customGameState().state == CurrentCustomGameState.Start}>
            <CustomGameStart />
        </Show>
        <Show when={customGameState().state == CurrentCustomGameState.Loading}>
            <SelectTeams />
        </Show>
    </div>);
}