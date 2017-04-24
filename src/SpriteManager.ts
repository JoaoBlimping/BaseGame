module Scumbag
{
  export function loadAnimations(sprite:Phaser.Sprite,game:Phaser.Game):void
  {
    let animations = game.cache.getJSON("animations").animations[<string>sprite.key];
    for (let animation of animations)
    {
      sprite.animations.add(animation.name,
                            Util.range(animation.frames[0] - 1,animation.frames[1] - 1),
                            animation.fps,animation.loop);
    }
  }
};
