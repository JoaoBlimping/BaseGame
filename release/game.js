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
            super(1200, 567, Phaser.AUTO, 'content', null, false, false);
            this.state.add('Boot', Scumbag.Boot, false);
            this.state.add('Preloader', Scumbag.Preloader, false);
            this.state.add('Level', Scumbag.Level, false);
            this.state.add('Win', Scumbag.Win, false);
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
        function playSong(key, channel = MusicChannel.Music) {
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
    class Player extends Phaser.Sprite {
        constructor(game, x, y, key, n) {
            super(game, x, y, key);
            this.n = n;
            Scumbag.loadAnimations(this, this.game);
            this.health = 3;
        }
        update() {
            let elapsed = this.game.time.elapsed / 1000;
            let input = Scumbag.InputManager.getInputDevice(this.n);
            this.x += input.getAxisState(Scumbag.Axis.Horizontal) * elapsed * 400;
            this.y += input.getAxisState(Scumbag.Axis.Vertical) * elapsed * 400;
            for (let child of this.children)
                child.update();
        }
        kill() {
            this.game.state.start("Win", true, false, this.n);
            return this;
        }
    }
    Scumbag.Player = Player;
    ;
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
        if (animations == undefined)
            return;
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
    class Worm extends Phaser.Sprite {
        constructor(game, x, y) {
            super(game, x, y, "worm");
            this.timer = 0;
            this.doom = false;
            Scumbag.loadAnimations(this, this.game);
            this.animations.play("wriggle");
            this.anchor.set(0.5);
            this.rotation = Math.random() * Math.PI * 2;
        }
        update() {
            if (this.doom) {
                this.destroy();
                return;
            }
            this.timer += this.game.time.elapsed;
            this.rotation = Math.sin(this.timer / 1000);
            for (let child of this.children)
                child.update();
        }
        doomed() {
            this.doom = true;
        }
    }
    Scumbag.Worm = Worm;
    ;
})(Scumbag || (Scumbag = {}));
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
    var InputManager;
    (function (InputManager) {
        let inputDevices = Array();
        function init(game, ...keysets) {
            for (let i = 0; i < keysets.length; i++) {
                inputDevices.push(new Scumbag.KeyboardInputDevice(game, keysets[i]));
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
        constructor(game, keyset = null) {
            super();
            if (keyset == null) {
                this.buttons = new Array(Scumbag.Button.nButtons);
                this.buttons[Scumbag.Button.Shoot] = game.input.keyboard.addKey(Phaser.KeyCode.Z);
                this.buttons[Scumbag.Button.Strafe] = game.input.keyboard.addKey(Phaser.KeyCode.SHIFT);
                this.buttons[Scumbag.Button.Bomb] = game.input.keyboard.addKey(Phaser.KeyCode.X);
                this.buttons[Scumbag.Button.Pause] = game.input.keyboard.addKey(Phaser.KeyCode.ESC);
                game.input.keyboard.addKey(Phaser.KeyCode.UP);
                game.input.keyboard.addKey(Phaser.KeyCode.DOWN);
                game.input.keyboard.addKey(Phaser.KeyCode.LEFT);
                game.input.keyboard.addKey(Phaser.KeyCode.RIGHT);
            }
            else {
                this.buttons = [];
                for (let button in Scumbag.Button)
                    this.buttons[button] = game.input.keyboard.addKey(keyset.buttons[button]);
                this.up = game.input.keyboard.addKey(keyset.up);
                this.down = game.input.keyboard.addKey(keyset.down);
                this.left = game.input.keyboard.addKey(keyset.left);
                this.right = game.input.keyboard.addKey(keyset.right);
            }
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
    function getAllChildren(worms) {
        let newWorms = [];
        for (let worm of worms) {
            if (worm.alive)
                newWorms.push(worm);
            newWorms.concat(getAllChildren(worm.children));
        }
        return newWorms;
    }
    function controlChildren(worms, freeWorms, players, currentPlayer, game) {
        for (let worm of worms)
            if (worm.children.length > 0)
                controlChildren(worm.children, freeWorms, players, currentPlayer, game);
        for (let worm of worms) {
            if (!worm.alive)
                continue;
            for (let player of players.children) {
                if (player == currentPlayer)
                    continue;
                if (worm.overlap(player)) {
                    game.sound.play("hit" + Math.floor(Math.random() * 2 + 1));
                    player.damage(1);
                    worm.doomed();
                }
                let children = getAllChildren(player.children);
                for (let child of children) {
                    if (worm.overlap(child) && child.children.length < 2) {
                        game.sound.play("clash");
                        if (child.children.length < 2)
                            child.doomed();
                        if (worm.children.length < 2)
                            worm.doomed();
                    }
                }
            }
            if (worm.children.length > 1)
                continue;
            for (let freeWorm of freeWorms) {
                if (worm.overlap(freeWorm)) {
                    freeWorm.position.x -= worm.worldPosition.x;
                    freeWorm.position.y -= worm.worldPosition.y;
                    worm.addChild(freeWorm);
                }
            }
        }
    }
    class Level extends Phaser.State {
        create() {
            this.background = new Scumbag.Background("junk", this.game);
            Scumbag.MusicManager.playSong("music", Scumbag.MusicChannel.Music);
            this.players = new Phaser.Group(this.game);
            for (let i = 0; i < 2; i++) {
                let player = new Scumbag.Player(this.game, this.game.width / 3 * (i + 1), this.game.height / 2, "face" + (i + 1), i);
                player.anchor.set(0.5);
                this.players.add(player);
            }
            this.worms = new Phaser.Group(this.game);
            for (let i = 0; i < 55; i++) {
                let worm = new Scumbag.Worm(this.game, Math.random() * this.game.width, Math.random() * this.game.height);
                this.worms.add(worm);
            }
        }
        update() {
            this.background.update();
            let elapsed = this.game.time.elapsed / 1000;
            if (Math.random() < 0.2) {
                let worm = new Scumbag.Worm(this.game, Math.random() * this.game.width, Math.random() * this.game.height);
                this.worms.add(worm);
            }
            this.worms.forEachAlive(function (worm) {
                for (let player of this.players.children) {
                    if (worm.overlap(player)) {
                        worm.position.x -= player.position.x;
                        worm.position.y -= player.position.y;
                        player.addChild(worm);
                    }
                }
            }, this);
            for (let player of this.players.children) {
                controlChildren(player.children, this.worms.children, this.players, player, this.game);
            }
        }
    }
    Scumbag.Level = Level;
})(Scumbag || (Scumbag = {}));
var Scumbag;
(function (Scumbag) {
    const P1_CONTROLS = {
        buttons: [],
        up: Phaser.KeyCode.UP,
        down: Phaser.KeyCode.DOWN,
        left: Phaser.KeyCode.LEFT,
        right: Phaser.KeyCode.RIGHT
    };
    const P2_CONTROLS = {
        buttons: [],
        up: Phaser.KeyCode.W,
        down: Phaser.KeyCode.S,
        left: Phaser.KeyCode.A,
        right: Phaser.KeyCode.D
    };
    class Preloader extends Phaser.State {
        preload() {
            this.preloadBar = this.add.sprite(0, 0, 'preloadBar');
            this.load.setPreloadSprite(this.preloadBar);
            this.game.load.pack("main", "pack.json");
            this.game.load.pack("sprites", "spritePack.json");
            this.game.load.json("animations", "animations.json");
            this.game.load.json("backgrounds", "data/backgrounds.json");
            Scumbag.InputManager.init(this.game, P1_CONTROLS, P2_CONTROLS);
        }
        create() {
            var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startMainMenu, this);
        }
        startMainMenu() {
            this.game.state.start('Win', true, false, -1);
        }
    }
    Scumbag.Preloader = Preloader;
})(Scumbag || (Scumbag = {}));
var Scumbag;
(function (Scumbag) {
    class Win extends Phaser.State {
        init(winner) {
            if (winner == 0)
                this.pic = this.game.add.image(0, 0, "sproingo");
            if (winner == 1)
                this.pic = this.game.add.image(0, 0, "derren");
            if (winner == -1)
                this.pic = this.game.add.image(0, 0, "start");
            this.space = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
        }
        update() {
            if (this.space.isDown)
                this.game.state.start("Level");
        }
    }
    Scumbag.Win = Win;
})(Scumbag || (Scumbag = {}));
//# sourceMappingURL=game.js.map