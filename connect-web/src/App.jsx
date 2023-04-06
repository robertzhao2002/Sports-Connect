import { batch, createSignal, Show } from "solid-js";
import { MLBMini, MLBMedium, MLBLarge, NBAMini, NBAMedium, NBALarge, NFLMini, NFLMedium, NFLLarge } from "./game/Modes";
import { pastGuesses, PastGuesses } from "./game/History";
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
  NFL: {
    Mini: "NFLMini",
    Medium: "NFLMedium",
    Large: "NFLLarge"
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

function startNFLMini(event) {
  event.preventDefault();
  batch(() => {
    setGameState({ state: State.NFL.Mini })
  });
}

function startNFLMedium(event) {
  event.preventDefault();
  batch(() => {
    setGameState({ state: State.NFL.Medium })
  });
}

function startNFLLarge(event) {
  event.preventDefault();
  batch(() => {
    setGameState({ state: State.NFL.Large })
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

      {/* MLB Modes */}
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

      {/* NBA Modes */}
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

      {/* NFL Modes */}
      <Show
        when={gameState().state == State.NFL.Mini}>
        <div class="gameContainer">
          <button class="backButton" onClick={back}>Back</button>
          <NFLMini />
        </div>
      </Show>
      <Show
        when={gameState().state == State.NFL.Medium}>
        <div class="gameContainer">
          <button class="backButton" onClick={back}>Back</button>
          <NFLMedium />
        </div>
      </Show>
      <Show
        when={gameState().state == State.NFL.Large}>
        <div class="gameContainer">
          <button class="backButton" onClick={back}>Back</button>
          <NFLLarge />
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
        <div align="center" class="gameMnu">
          <h1>Welcome to Sports Connect!</h1>
          <h2>Connect the teams by naming a player that played for both teams!</h2>
          <div class="mlbGames menuCard">
            <h2>MLB Mode</h2>
            <button onClick={startMLBMini}><img height="20px" width="20px" src="/pictures/mlb.png" /></button>
            <button onClick={startMLBMedium}>
              <img height="20px" width="20px" src="/pictures/mlb.png" />
              <img height="20px" width="20px" src="/pictures/mlb.png" />
            </button>
            <button onClick={startMLBLarge}>
              <img height="20px" width="20px" src="/pictures/mlb.png" />
              <img height="20px" width="20px" src="/pictures/mlb.png" />
              <img height="20px" width="20px" src="/pictures/mlb.png" />
            </button>
          </div>
          <div class="nbaGames menuCard">
            <h2>NBA Mode</h2>
            <button onClick={startNBAMini}>
              <img height="20px" width="20px" src="/pictures/nba.png" />
            </button>
            <button onClick={startNBAMedium}>
              <img height="20px" width="20px" src="/pictures/nba.png" />
              <img height="20px" width="20px" src="/pictures/nba.png" />
            </button>
            <button onClick={startNBALarge}>
              <img height="20px" width="20px" src="/pictures/nba.png" />
              <img height="20px" width="20px" src="/pictures/nba.png" />
              <img height="20px" width="20px" src="/pictures/nba.png" />
            </button>
          </div>
          <div class="nflGames menuCard">
            <h2>NFL Mode</h2>
            <button onClick={startNFLMini}>
              <img height="20px" width="20px" src="/pictures/nfl.png" />
            </button>
            <button onClick={startNFLMedium}>
              <img height="20px" width="20px" src="/pictures/nfl.png" />
              <img height="20px" width="20px" src="/pictures/nfl.png" />
            </button>
            <button onClick={startNFLLarge}>
              <img height="20px" width="20px" src="/pictures/nfl.png" />
              <img height="20px" width="20px" src="/pictures/nfl.png" />
              <img height="20px" width="20px" src="/pictures/nfl.png" />
            </button>
          </div>
          <div class="customGames menuCard">
            <h2>Other Game Modes</h2>
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
