module Scumbag
{

  export namespace InputManager
  {
    let inputDevices = Array<InputDevice>();

    export function init(game:Phaser.Game,...keysets:KeyboardKeyset[]):void
    {
      for (let i = 0;i < keysets.length;i++)
      {
        inputDevices.push(new KeyboardInputDevice(game,keysets[i]))
      }
    }

    export function getInputDevice(id:number):InputDevice
    {
      return inputDevices[id];
    }

  }
}
