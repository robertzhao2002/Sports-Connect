import { ConnectGame } from "./Game.jsx";

export function NBAMini() {
    return ConnectGame('nba', 1);
}

export function MLBMini() {
    return ConnectGame('mlb', 1);
}

export function NBAMedium() {
    return ConnectGame('nba', 2);
}

export function MLBMedium() {
    return ConnectGame('mlb', 2);
}

export function NBALarge() {
    return ConnectGame('nba', 3);
}

export function MLBLarge() {
    return ConnectGame('mlb', 3);
}

export function NFLMini() {
    return ConnectGame('nfl', 1);
}

export function NFLMedium() {
    return ConnectGame('nfl', 2);
}

export function NFLLarge() {
    return ConnectGame('nfl', 3);
}