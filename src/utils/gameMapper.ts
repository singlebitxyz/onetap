export const gameMapper = (gameId: number) => {
    let game = "";
    switch (gameId) {
      case 1:
        game = "dota2";
        break;
      case 2:
        game = "valorant";
        break;
      case 3:
        game = "cod_warzone";
        break;
      case 4:
        game = "pubg";
        break;
      case 5:
        game = "fallguys";
        break;
      case 6:
        game = "fortnite";
        break;
      case 7:
        game = "hearthstone";
        break;
      default:
        game = "pubg";
    }
    return game;
};