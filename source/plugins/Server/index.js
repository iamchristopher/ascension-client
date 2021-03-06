import EventEmitter from 'eventemitter3';
import Client from 'boardgame.io/client';
import Game from 'boardgame.io/core';

import config from '../../../core/common/game';

export default class ServerPlugin extends Phaser.Plugins.BasePlugin {

    #events = new EventEmitter()

    #client

    connect (room, player) {
        this.#client = Client.Client({
            enhancer: window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
            game: Game.Game(config()),
            gameID: room,
            multiplayer: {
                server: 'https://ascension-server.herokuapp.com',
            },
            playerID: player,
        });
        this.#client.connect();
    }

    on (event, fn) {
        this.#events.on(event, fn);

        return this;
    }

    subscribe (fn, context) {
        const unsubscribe = this.#client.store.subscribe(() => {
            const state = this.#client.store.getState();

            return fn.call(context, state, unsubscribe);
        });

        return unsubscribe;
    }

    get client () {
        return this.#client;
    }

}
