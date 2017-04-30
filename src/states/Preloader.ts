/// <reference path="../phaser/phaser.d.ts"/>


module Scumbag
{
  const P1_CONTROLS:KeyboardKeyset =
  {
    buttons:[],
    up:Phaser.KeyCode.UP,
    down:Phaser.KeyCode.DOWN,
    left:Phaser.KeyCode.LEFT,
    right:Phaser.KeyCode.RIGHT
  };

  const P2_CONTROLS:KeyboardKeyset =
  {
    buttons:[],
    up:Phaser.KeyCode.W,
    down:Phaser.KeyCode.S,
    left:Phaser.KeyCode.A,
    right:Phaser.KeyCode.D
  };


  export class Preloader extends Phaser.State
  {
    preloadBar: Phaser.Sprite;

    preload()
    {
      //Set up our preloader sprites
      this.preloadBar = this.add.sprite(0,0,'preloadBar');

      //set the preload bar as a preload bar
      this.load.setPreloadSprite(this.preloadBar);

      //Load our actual games assets
      this.game.load.pack("main","pack.json");
      this.game.load.pack("sprites","spritePack.json");
      this.game.load.json("animations","animations.json");
      this.game.load.json("backgrounds","data/backgrounds.json");

      // Init the input manager.
      InputManager.init(this.game,P1_CONTROLS,P2_CONTROLS);
    }

    create()
    {
      var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
      tween.onComplete.add(this.startMainMenu, this);
    }

    startMainMenu()
    {
      this.game.state.start('Level', true, false);
    }
  }
}
