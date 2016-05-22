class Game {
  constructor(public id: string) {
  }
}

let games: {[id: string]: Game} = {};

function addGame(game: Game) {
  games[game.id] = game;
}

addGame(new Game("hello"));

export {Game, games};
