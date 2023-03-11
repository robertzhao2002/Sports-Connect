import { ConnectGame } from "./Game.jsx";

export function NBAMini() {
    return ConnectGame(false, 1);
}

export function MLBMini() {
    return ConnectGame(true, 1);
}

export function NBAMedium() {
    return ConnectGame(false, 2);
}

export function MLBMedium() {
    return ConnectGame(true, 2);
}

export function NBALarge() {
    return ConnectGame(false, 3);
}

export function MLBLarge() {
    return ConnectGame(true, 3);
}