var Scumbag;
(function (Scumbag) {
    function getBackgroundData(key, data) {
        for (let i = 0; i < data.backgrounds.length; i++) {
            if (data.backgrounds[i].name == key)
                return data.backgrounds[i];
        }
        console.error("couldn't find background with name " + key);
    }
    class Background {
        constructor(key, game) {
            this.images = [];
            this.time = 0;
            this.game = game;
            this.data = getBackgroundData(key, this.game.cache.getJSON("backgrounds"));
            for (let i = 0; i < this.data.content.length; i++) {
                let image = game.add.tileSprite(0, 0, this.game.width, this.game.height, this.data.content[i].image);
                image.fixedToCamera = true;
                if (this.data.content[i].hasOwnProperty("speed")) {
                    image.animations.add("move");
                    image.animations.play("move", this.data.content[i].speed, true);
                }
                this.images.push(image);
            }
        }
        update() {
            for (let i = 0; i < this.data.content.length; i++) {
                this.time += this.game.time.elapsedMS / 1000;
                this.images[i].tilePosition.x = (0 - this.game.camera.x) + this.time * this.data.content[i].x;
                this.images[i].tilePosition.y = (0 - this.game.camera.y) + this.time * this.data.content[i].y;
            }
        }
    }
    Scumbag.Background = Background;
})(Scumbag || (Scumbag = {}));
var Scumbag;
(function (Scumbag) {
    class Game extends Phaser.Game {
        constructor() {
            super(832, 410, Phaser.AUTO, 'content', null, false, false);
            this.state.add('Boot', Scumbag.Boot, false);
            this.state.add('Preloader', Scumbag.Preloader, false);
            this.state.add('Credits', Scumbag.Credits, false);
            this.state.start('Boot');
        }
    }
    Scumbag.Game = Game;
})(Scumbag || (Scumbag = {}));
var Scumbag;
(function (Scumbag) {
    (function (MusicChannel) {
        MusicChannel[MusicChannel["Music"] = 0] = "Music";
        MusicChannel[MusicChannel["Ambience"] = 1] = "Ambience";
        MusicChannel[MusicChannel["NChannels"] = 2] = "NChannels";
    })(Scumbag.MusicChannel || (Scumbag.MusicChannel = {}));
    var MusicChannel = Scumbag.MusicChannel;
    var MusicManager;
    (function (MusicManager) {
        let game;
        let currentSongKey = new Array(MusicChannel.NChannels);
        let currentSong = new Array(MusicChannel.NChannels);
        function init(theGame) {
            game = theGame;
        }
        MusicManager.init = init;
        function playSong(key, channel) {
            if (currentSongKey[channel] == key)
                return;
            if (currentSongKey[channel] != null) {
                game.sound.removeByKey(currentSongKey[channel]);
            }
            currentSongKey[channel] = key;
            currentSong[channel] = game.add.audio(key, 1, true);
            currentSong[channel].play();
        }
        MusicManager.playSong = playSong;
        function stopSong(channel) {
            if (currentSong[channel] != null) {
                currentSong[channel].destroy();
                currentSongKey[channel] = null;
            }
        }
        MusicManager.stopSong = stopSong;
        function fadeOut(time, channel) {
            if (currentSong[channel] != null) {
                currentSong[channel].fadeOut(time);
            }
        }
        MusicManager.fadeOut = fadeOut;
    })(MusicManager = Scumbag.MusicManager || (Scumbag.MusicManager = {}));
})(Scumbag || (Scumbag = {}));
var Scumbag;
(function (Scumbag) {
    function createRegions(data) {
        let regions = {};
        for (let i = 0; i < data.length; i++) {
            let name = data[i].name;
            let x = data[i].x;
            let y = data[i].y;
            let width = data[i].width;
            let height = data[i].height;
            let script = null;
            if (data[i].hasOwnProperty("properties")) {
                if (data[i].properties.hasOwnProperty("script")) {
                    script = data[i].properties.script;
                }
            }
            regions[name] = { x: x, y: y, width: width, height: height, script: script,
                properties: data[i].properties };
        }
        return regions;
    }
    Scumbag.createRegions = createRegions;
})(Scumbag || (Scumbag = {}));
;
var Scumbag;
(function (Scumbag) {
    function loadAnimations(sprite, game) {
        let animations = game.cache.getJSON("animations").animations[sprite.key];
        for (let animation of animations) {
            sprite.animations.add(animation.name, Scumbag.Util.range(animation.frames[0] - 1, animation.frames[1] - 1), animation.fps, animation.loop);
        }
    }
    Scumbag.loadAnimations = loadAnimations;
})(Scumbag || (Scumbag = {}));
;
var Scumbag;
(function (Scumbag) {
    var Util;
    (function (Util) {
        function slow(value) {
            if (value.x > 1)
                value.x = 1;
            else if (value.x < -1)
                value.x = -1;
            else
                value.x = 0;
            if (value.y > 1)
                value.y = 1;
            else if (value.y < -1)
                value.y = -1;
            else
                value.y = 0;
        }
        Util.slow = slow;
        function evaluateDirection(direction) {
            if (direction == "up")
                return Math.PI / 2;
            else if (direction == "left")
                return Math.PI;
            else if (direction == "down")
                return -1 * Math.PI / 2;
            else if (direction == "right")
                return 0;
            else
                return parseInt(direction);
        }
        Util.evaluateDirection = evaluateDirection;
        function onScreen(x, y, game) {
            return (x >= game.camera.x && x <= game.camera.x + game.camera.width &&
                y >= game.camera.y && y <= game.camera.y + game.camera.height);
        }
        Util.onScreen = onScreen;
        function range(min, max) {
            let list = [];
            for (let i = min; i <= max; i++)
                list.push(i);
            return list;
        }
        Util.range = range;
    })(Util = Scumbag.Util || (Scumbag.Util = {}));
    ;
})(Scumbag || (Scumbag = {}));
;
var Scumbag;
(function (Scumbag) {
    (function (Button) {
        Button[Button["Shoot"] = 0] = "Shoot";
        Button[Button["Strafe"] = 1] = "Strafe";
        Button[Button["Bomb"] = 2] = "Bomb";
        Button[Button["Pause"] = 3] = "Pause";
        Button[Button["nButtons"] = 4] = "nButtons";
    })(Scumbag.Button || (Scumbag.Button = {}));
    var Button = Scumbag.Button;
    (function (Axis) {
        Axis[Axis["Horizontal"] = 0] = "Horizontal";
        Axis[Axis["Vertical"] = 1] = "Vertical";
        Axis[Axis["nAxes"] = 2] = "nAxes";
    })(Scumbag.Axis || (Scumbag.Axis = {}));
    var Axis = Scumbag.Axis;
    class InputDevice {
    }
    Scumbag.InputDevice = InputDevice;
})(Scumbag || (Scumbag = {}));
var Scumbag;
(function (Scumbag) {
    class GamepadInputDevice extends Scumbag.InputDevice {
        constructor(pad) {
            super();
            this.pad = pad;
            this.buttons = new Array(Scumbag.Button.nButtons);
            this.buttons[Scumbag.Button.Shoot] = this.pad.getButton(Phaser.Gamepad.XBOX360_RIGHT_TRIGGER);
            this.buttons[Scumbag.Button.Strafe] = this.pad.getButton(Phaser.Gamepad.XBOX360_A);
            this.buttons[Scumbag.Button.Bomb] = this.pad.getButton(Phaser.Gamepad.XBOX360_X);
            this.buttons[Scumbag.Button.Pause] = this.pad.getButton(Phaser.Gamepad.XBOX360_START);
            this.axes = new Array(Scumbag.Axis.nAxes);
            this.axes[Scumbag.Axis.Horizontal] = Phaser.Gamepad.XBOX360_STICK_LEFT_X;
            this.axes[Scumbag.Axis.Vertical] = Phaser.Gamepad.XBOX360_STICK_LEFT_Y;
        }
        getButtonState(button) {
            return this.buttons[button].isDown;
        }
        getAxisState(axis) {
            let axisState = this.pad.axis(this.axes[axis]);
            if (!axisState)
                return 0;
            return axisState;
        }
        addOnButtonPress(button, callback, context) {
            this.buttons[button].onDown.add(callback, context);
        }
        removeOnButtonPress(button, callback, context) {
            this.buttons[button].onDown.remove(callback, context);
        }
        clear() {
            for (let i = 0; i < Scumbag.Button.nButtons; i++) {
                this.buttons[i].onDown.removeAll();
            }
        }
    }
    Scumbag.GamepadInputDevice = GamepadInputDevice;
})(Scumbag || (Scumbag = {}));
var Scumbag;
(function (Scumbag) {
    const N_INPUT_DEVICES = 1;
    var InputManager;
    (function (InputManager) {
        let inputDevices = Array(N_INPUT_DEVICES);
        function init(game) {
            let pad = game.input.gamepad.pad1;
            if (game.input.gamepad.supported && game.input.gamepad.active &&
                pad.connected) {
                console.log("using gamepad");
                inputDevices[0] = new Scumbag.GamepadInputDevice(pad);
            }
            else {
                console.log("using keyboard");
                inputDevices[0] = new Scumbag.KeyboardInputDevice(game);
            }
        }
        InputManager.init = init;
        function getInputDevice(id) {
            return inputDevices[id];
        }
        InputManager.getInputDevice = getInputDevice;
    })(InputManager = Scumbag.InputManager || (Scumbag.InputManager = {}));
})(Scumbag || (Scumbag = {}));
var Scumbag;
(function (Scumbag) {
    class KeyboardInputDevice extends Scumbag.InputDevice {
        constructor(game) {
            super();
            this.buttons = new Array(Scumbag.Button.nButtons);
            this.buttons[Scumbag.Button.Shoot] = game.input.keyboard.addKey(Phaser.KeyCode.Z);
            this.buttons[Scumbag.Button.Strafe] = game.input.keyboard.addKey(Phaser.KeyCode.SHIFT);
            this.buttons[Scumbag.Button.Bomb] = game.input.keyboard.addKey(Phaser.KeyCode.X);
            this.buttons[Scumbag.Button.Pause] = game.input.keyboard.addKey(Phaser.KeyCode.ESC);
            this.up = game.input.keyboard.addKey(Phaser.KeyCode.UP);
            this.down = game.input.keyboard.addKey(Phaser.KeyCode.DOWN);
            this.left = game.input.keyboard.addKey(Phaser.KeyCode.LEFT);
            this.right = game.input.keyboard.addKey(Phaser.KeyCode.RIGHT);
        }
        getButtonState(button) {
            return this.buttons[button].isDown;
        }
        getAxisState(axis) {
            if (axis == Scumbag.Axis.Horizontal) {
                if (this.left.isDown && this.right.isDown)
                    return 0;
                if (this.left.isDown)
                    return -1;
                if (this.right.isDown)
                    return 1;
                return 0;
            }
            if (axis == Scumbag.Axis.Vertical) {
                if (this.up.isDown && this.down.isDown)
                    return 0;
                if (this.up.isDown)
                    return -1;
                if (this.down.isDown)
                    return 1;
                return 0;
            }
        }
        addOnButtonPress(button, callback, context) {
            this.buttons[button].onDown.add(callback, context);
        }
        removeOnButtonPress(button, callback, context) {
            this.buttons[button].onDown.remove(callback, context);
        }
        clear() {
            for (let i = 0; i < Scumbag.Button.nButtons; i++) {
                this.buttons[i].onDown.removeAll();
            }
        }
    }
    Scumbag.KeyboardInputDevice = KeyboardInputDevice;
})(Scumbag || (Scumbag = {}));
var Scumbag;
(function (Scumbag) {
    class Boot extends Phaser.State {
        preload() {
            this.load.image('preloadBar', 'images/preloadBar.png');
        }
        create() {
            this.input.maxPointers = 1;
            this.stage.disableVisibilityChange = true;
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.pageAlignHorizontally = true;
            this.game.stage.smoothed = false;
            Scumbag.MusicManager.init(this.game);
            this.game.input.gamepad.start();
            this.game.state.start('Preloader', true, false);
        }
    }
    Scumbag.Boot = Boot;
})(Scumbag || (Scumbag = {}));
var Scumbag;
(function (Scumbag) {
    const PADDING = 40;
    let headingFont = { font: "50px Serif", fontStyle: "bold", fill: "#f00", stroke: "#00f", strokeThickness: 5 };
    let bodyFont = { font: "20px Serif", fill: "#ff6", align: "center", wordWrap: true, wordWrapWidth: 0 };
    let outside;
    let stop = false;
    function move(a) {
        a.y -= 0.6;
        if (a.y > 0)
            outside = false;
    }
    class Credits extends Phaser.State {
        init(score = 0) {
            this.score = score;
        }
        create() {
            let data = this.game.cache.getJSON("credits");
            this.background = this.add.sprite(0, 0, data.background);
            Scumbag.MusicManager.stopSong(Scumbag.MusicChannel.Ambience);
            Scumbag.MusicManager.playSong(data.music, Scumbag.MusicChannel.Music);
            bodyFont.wordWrapWidth = this.game.width;
            this.items = this.game.add.group();
            let y = this.game.height;
            for (let i = 0; i < data.items.length; i++) {
                let item;
                if (data.items[i].type == "text") {
                    item = this.game.add.text(this.game.width / 2, y, data.items[i].content, bodyFont);
                }
                else if (data.items[i].type == "heading") {
                    item = this.game.add.text(this.game.width / 2, y, data.items[i].content, headingFont);
                    item.setShadow(0, 0, 'rgba(0,1,0,1)', 5);
                    item.update = function () {
                        this.strokeThickness = Math.random() * 36 + Math.sin(this.y / 8) * 20;
                    };
                }
                else if (data.items[i].type == "image") {
                    item = this.game.add.image(this.game.width / 2, y, data.items[i].content);
                }
                else if (data.items[i].type == "score") {
                    item = this.game.add.text(this.game.width / 2, y, "your score is " + this.score, bodyFont);
                }
                item.anchor.setTo(0.5, 0);
                this.items.add(item);
                y += item.height + PADDING;
            }
        }
        update() {
            outside = true;
            this.items.forEach(move, null);
            if (outside && !stop) {
                let tween = this.add.tween(this.background).to({ alpha: 0 }, 2000, Phaser.Easing.Default, true);
                tween.onComplete.add(function () { this.game.state.start("MainMenu", true, false); }, this);
                stop = true;
            }
        }
    }
    Scumbag.Credits = Credits;
})(Scumbag || (Scumbag = {}));
var Scumbag;
(function (Scumbag) {
    class Preloader extends Phaser.State {
        preload() {
            this.preloadBar = this.add.sprite(0, 0, 'preloadBar');
            this.load.setPreloadSprite(this.preloadBar);
            this.game.load.pack("main", "pack.json");
            this.game.load.pack("sprites", "spritePack.json");
            this.game.load.pack("scripts", "scriptPack.json");
            this.game.load.json("animations", "animations.json");
            this.game.load.json("enemies", "data/enemies.json");
            this.game.load.json("credits", "data/credits.json");
            this.game.load.json("backgrounds", "data/backgrounds.json");
        }
        create() {
            var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startMainMenu, this);
        }
        startMainMenu() {
            this.game.state.start('MainMenu', true, false);
        }
    }
    Scumbag.Preloader = Preloader;
})(Scumbag || (Scumbag = {}));
//# sourceMappingURL=game.js.map