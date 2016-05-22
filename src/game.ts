class Game {
  constructor(public id: string) {
  }
}

let games: {[id: string]: Game} = {};

export {Game, games};
