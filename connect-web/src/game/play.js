import { randomTeams, getMatrix } from './teams.js';
import { possibleSolution } from './search.js';
import promptSync from 'prompt-sync'

const prompt = promptSync();

const length = parseInt(prompt('Enter the number of teams you want on one side of the square: '));
const maxScore = length * length;
const teams = randomTeams(length * 2);
const board = getMatrix(teams);

// board = { 'PHI,TOR': null };
// createGame(2);
// for (const [teams, value] of Object.entries(board)) {
//     const [team1, team2] = teams.split(',');
//     console.log(team1, team2);
// }
// console.log(Object.keys(board).length);
// possibleSolution(Object.keys(board)).then(function (result) {
//     console.log(result);
// });