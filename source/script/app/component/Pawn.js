'use strict';

define(['phaser', 'state/Game', 'component/Event'], function (Phaser, Game, Event) {
    function Pawn (game, group, options) {
        Phaser.Sprite.call(
            this,
            game,
            options.transform.position.x,
            options.transform.position.y,
            options.asset
        );

        group.add(this);

        this._game = game;
        this.height = options.transform.height;
        this.width = options.transform.width;
        this._graphics = this._game.add.sprite(0, 0);
        this._moving = false;

        // Setup graphics object for drawing UI elememts for this pawn
        this._tile_traces = game.add.group();
        this._tile_collisions = game.add.group();

        // Physics settings
        this._game.physics.arcade.enable(this._tile_collisions);
        this._game.physics.arcade.enable(this);
        this.body.setSize(50, 50, 0, 0);
        this.body.moves = false;

        this._game.add.existing(this);

        this._setupEvents();

        var self = this;
        Event.on('game.update', function (game_state) {
            self._update.apply(self, [
                game_state.collision_group
            ]);
        });
    }

    Pawn.prototype = Object.create(Phaser.Sprite.prototype);
    Pawn.prototype.constructor = Pawn;

    Pawn.prototype._setupEvents = function () {
        this.inputEnabled = true;
        this.input.useHandCursor = true;

        this.events.onInputOver.add(this._mouseOver, this);
        this.events.onInputOut.add(this._mouseOut, this);
    };

    Pawn.prototype._mouseOver = function () {
    };

    Pawn.prototype._update = function () {
        console.warn('Default [%s] update. You might want to consider overriding this.', this.constructor.name);
    };

    Pawn.prototype._mouseOut = function () {
    };

    Pawn.prototype._moveTo = function (position, callback) {
        var new_pos = {
                x: position.x - (position.x % 50),
                y: position.y - (position.y % 50)
            },
            line = new Phaser.Line(
                this.position.x,
                this.position.y,
                new_pos.x,
                new_pos.y
            ),
            length = Math.floor(line.length),
            movement_duration = (length - (length % 50)) * 10;

        this._moving = true;
        this.game.add.tween(this)
            .to(new_pos, movement_duration, Phaser.Easing.Linear.None)
            .start()
            .onComplete.add(function () {
                this._moving = false;
            }, this);
    }

    return Pawn;
});
