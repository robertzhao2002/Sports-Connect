# Sports Connect

This is a game that picks random pairs of teams, and you need to think of players that have played for both teams.

## Game Modes

There are 3 game modes: baseball, basketball, and football. The default game mode is baseball, but you can play the other 2 modes by using command line arguments.

## Solver

For baseball mode, I webscraped [this page](https://www.baseball-reference.com/friv/multifranchise.cgi) and returned the players with the most HR and IP with each respective team. This feature does not yet work for other sports mode yet.