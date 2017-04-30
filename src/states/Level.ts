/// <reference path="../phaser/phaser.d.ts"/>


module Scumbag
{
  export class Level extends Phaser.State
  {
    background: Background;

    create()
    {
      // Load the Background.
      this.background = new Background("junk",this.game);

      // Put on the music.
      MusicManager.playSong("music",MusicChannel.Music);
    }

    update()
    {
      this.background.update();

      let elapsed = this.game.time.elapsed / 1000;
    }
  }
}
