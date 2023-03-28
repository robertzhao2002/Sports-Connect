import { batch, createSignal, Show } from "solid-js";
import { MLBMini, MLBMedium, MLBLarge, NBAMini, NBAMedium, NBALarge } from "./game/Modes";
import { pastGuesses, PastGuesses } from "./game/Game";
import { CustomGame, CurrentCustomGameState, setCustomGameState, resetCustomGame } from "./game/Custom";

const [gameState, setGameState] = createSignal({ state: "Loading" });
const State = {
  Loading: "Loading",
  MLB: {
    Mini: "MLBMini",
    Medium: "MLBMedium",
    Large: "MLBLarge"
  },
  NBA: {
    Mini: "NBAMini",
    Medium: "NBAMedium",
    Large: "NBALarge"
  },
  Custom: {
    Board: "CustomBoard",
    One: "CustomOne"
  }
}


function startMLBMini(event) {
  event.preventDefault();
  batch(() => {
    setGameState({ state: State.MLB.Mini })
  });
}

function startMLBMedium(event) {
  event.preventDefault();
  batch(() => {
    setGameState({ state: State.MLB.Medium })
  });
}

function startMLBLarge(event) {
  event.preventDefault();
  batch(() => {
    setGameState({ state: State.MLB.Large })
  });
}

function startNBAMini(event) {
  event.preventDefault();
  batch(() => {
    setGameState({ state: State.NBA.Mini })
  });
}

function startNBAMedium(event) {
  event.preventDefault();
  batch(() => {
    setGameState({ state: State.NBA.Medium })
  });
}

function startNBALarge(event) {
  event.preventDefault();
  batch(() => {
    setGameState({ state: State.NBA.Large })
  });
}

function startSelectingTeams(event) {
  event.preventDefault();
  batch(() => {
    setGameState({ state: State.Custom.Board })
    setCustomGameState({ state: CurrentCustomGameState.Loading })
    resetCustomGame()
  });
}

function back(event) {
  event.preventDefault();
  batch(() => {
    setGameState({ state: State.Loading })
    resetCustomGame();
  });
}

function App() {
  console.log(gameState());
  return (
    <div class="gameContainer">
      <Show
        when={gameState().state == State.MLB.Mini}>
        <div class="gameContainer">
          <button class="backButton" onClick={back}>Back</button>
          <MLBMini />
        </div>
      </Show>
      <Show
        when={gameState().state == State.MLB.Medium}>
        <div class="gameContainer">
          <button class="backButton" onClick={back}>Back</button>
          <MLBMedium />
        </div>
      </Show>
      <Show
        when={gameState().state == State.MLB.Large}>
        <div class="gameContainer">
          <button class="backButton" onClick={back}>Back</button>
          <MLBLarge />
        </div>
      </Show>
      <Show
        when={gameState().state == State.NBA.Mini}>
        <div class="gameContainer">
          <button class="backButton" onClick={back}>Back</button>
          <NBAMini />
        </div>
      </Show>
      <Show
        when={gameState().state == State.NBA.Medium}>
        <div class="gameContainer">
          <button class="backButton" onClick={back}>Back</button>
          <NBAMedium />
        </div>
      </Show>
      <Show
        when={gameState().state == State.NBA.Large}>
        <div class="gameContainer">
          <button class="backButton" onClick={back}>Back</button>
          <NBALarge />
        </div>
      </Show>
      <Show
        when={gameState().state == State.Custom.Board}>
        <div class="gameContainer">
          <button class="backButton" onClick={back}>Back</button>
          <CustomGame />
        </div>
      </Show>
      <Show
        when={gameState().state == State.Loading}>
        <div align="center">
          <h1>Welcome to Sports Connect!</h1>
          <h2>Connect the teams by naming a player that played for both teams!</h2>
          <div class="menuButtons">
            <button onClick={startMLBMini}>MLB Mini (1x1)</button>
            <button onClick={startMLBMedium}>MLB Medium (2x2)</button>
            <button onClick={startMLBLarge}>MLB Large (3x3)</button>
            <button>MLB XL (Coming Soon ...) </button>
            <button onClick={startNBAMini}>NBA Mini (1x1)</button>
            <button onClick={startNBAMedium}>NBA Medium (2x2)</button>
            <button onClick={startNBALarge}>NBA Large (3x3)</button>
            <button>NBA XL (Coming Soon ...) </button>
            <button onClick={startSelectingTeams}>Custom Mode</button>
            <button >Single (Coming Soon ...) </button>
          </div>
          <div>
            <h2>Before you start, you need to activate a CORS Proxy to query Sports Reference</h2>
            <a href="https://cors-anywhere.herokuapp.com" target="_blank">Activate CORS Proxy</a>
          </div>
        </div>
      </Show>

      <Show
        when={pastGuesses().length > 0}>
        <PastGuesses />
      </Show>

    </div>
  );
}
export default App;
