///<reference path="phaser/phaser.d.ts"/>

module Scumbag
{
  export class Game extends Phaser.Game
  {
    constructor()
    {
      super(1200,567,Phaser.AUTO,'content',null,false,false);

      this.state.add('Boot',Boot,false);
      this.state.add('Preloader',Preloader,false);
      this.state.add('Level',Level,false);
      this.state.add('Win',Win,false);

      this.state.start('Boot');
    }
  }
}
