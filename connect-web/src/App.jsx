import { batch, createSignal, Show } from "solid-js";
import { MLB, NBA } from "./Game";

const [gameState, setGameState] = createSignal({ state: "Loading" });
const State = {
  Loading: "Loading",
  MLB: "MLB",
  NBA: "NBA"
}


function startMLB(event) {
  event.preventDefault();
  batch(() => {
    setGameState({ state: State.MLB })
  });
}

function startNBA(event) {
  event.preventDefault();
  batch(() => {
    setGameState({ state: State.NBA })
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
        when={gameState().state == State.MLB}>
        <button onClick={back}>Back</button>
        <MLB />
      </Show>
      <Show
        when={gameState().state == State.NBA}>
        <button onClick={back}>Back</button>
        <NBA />
      </Show>
      <Show
        when={gameState().state == State.Loading}>
        <div align="center">
          <h1>Welcome to Sports Connect!</h1>
          <h2>Connect the teams by naming a player that played for both teams!</h2>
          <button onClick={startMLB}>MLB</button><button onClick={startNBA}>NBA</button>
          <div>
            <h2>Before you start, you need to activate a CORS Proxy to query Sports Reference</h2>
            <a href="https://cors-anywhere.herokuapp.com" target="_blank">Activate CORS Proxy</a>
          </div>
        </div>

      </Show>

    </div>
  );
}
export default App;
