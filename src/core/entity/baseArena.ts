import { BasePlayer } from "./basePlayer";

export class BaseArena<TPlayer extends BasePlayer> {

  private players: TPlayer[] = [];

  constructor(
    public name: string
  ) { }

  public addPlayer(player: TPlayer) {
    this.players.push(player);
  }

  public getPlayers() {
    return this.players;
  }
}
