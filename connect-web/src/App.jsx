import { batch, createSignal, Show } from "solid-js";
import { MLBMini, MLBMedium, MLBLarge, NBAMini, NBAMedium, NBALarge } from "./game/Modes";
import { PastGuesses } from "./game/Game";

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

function back(event) {
  event.preventDefault();
  batch(() => {
    setGameState({ state: State.Loading })
  });
}

function App() {
  console.log(gameState());
  return (
    <div>
      <Show
        when={gameState().state == State.MLB.Mini}>
        <div align="center">
          <button onClick={back}>Back</button>
          <MLBMini />
        </div>
      </Show>
      <Show
        when={gameState().state == State.MLB.Medium}>
        <div align="center">
          <button onClick={back}>Back</button>
          <MLBMedium />
        </div>
      </Show>
      <Show
        when={gameState().state == State.MLB.Large}>
        <div align="center">
          <button onClick={back}>Back</button>
          <MLBLarge />
        </div>
      </Show>
      <Show
        when={gameState().state == State.NBA.Mini}>
        <div align="center">
          <button onClick={back}>Back</button>
          <NBAMini />
        </div>
      </Show>
      <Show
        when={gameState().state == State.NBA.Medium}>
        <div align="center">
          <button onClick={back}>Back</button>
          <NBAMedium />
        </div>
      </Show>
      <Show
        when={gameState().state == State.NBA.Large}>
        <div align="center">
          <button onClick={back}>Back</button>
          <NBALarge />
        </div>
      </Show>
      <Show
        when={gameState().state == State.Loading}>
        <div align="center">
          <h1>Welcome to Sports Connect!</h1>
          <h2>Connect the teams by naming a player that played for both teams!</h2>
          <button onClick={startMLBMini}>MLB Mini (1x1)</button>
          <button onClick={startMLBMedium}>MLB Medium (2x2)</button>
          <button onClick={startMLBLarge}>MLB Large (3x3)</button>
          <button onClick={startNBAMini}>NBA Mini (1x1)</button>
          <button onClick={startNBAMedium}>NBA Medium (2x2)</button>
          <button onClick={startNBALarge}>NBA Large (3x3)</button>
          <div>
            <h2>Before you start, you need to activate a CORS Proxy to query Sports Reference</h2>
            <a href="https://cors-anywhere.herokuapp.com" target="_blank">Activate CORS Proxy</a>
          </div>
        </div>
      </Show>
      <PastGuesses />
    </div>
  );
}
export default App;
