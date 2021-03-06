import Pawn from './Pawn';

export default class extends Phaser.Plugins.BasePlugin {

    start (client, pathfinder) {
        this.client = client;
        this.pathfinder = pathfinder;
        this.pawns = this.pluginManager.add.group();
        this.deceased = [];

        this.client.store.subscribe(() => this.sync(this.client.store.getState()));
        this.sync(this.client.store.getState());

        const {
            pluginManager: {
                scene: {
                    scene
                }
            }
        } = this;

        scene.input.keyboard.on('keydown_V', () =>
            this.pawns.children.each(pawn => pawn.data.set({
                showHealthBar: true
            }))
        )
        scene.input.keyboard.on('keyup_V', () =>
            this.pawns.children.each(pawn => pawn.data.set({
                showHealthBar: false
            }))
        )

        scene.events.on('PAWN_DESTROY', pawn => this.deceased.push(pawn.id));
    }

    add (options) {
        const id = options.id || Date.now().toString();
        const exists = this.get('id', id);

        if (typeof exists !== 'undefined') {
            return exists;
        }

        const pawn = new Pawn({
            ...options,
            id,
            client: this.client,
            game: this.pluginManager,
            manager: this,
            pathfinder: this.pathfinder
        });

        this.pawns.add(pawn, true);

        const {
            currentHealth
        } = pawn.data.getAll();
        if (currentHealth <= 0) {
            pawn.destroy();
        }

        return pawn;
    }

    get (field, value) {
        if (!this.pawns) {
            return;
        }

        const children = this.pawns.getChildren();

        if (typeof field === 'string') {
            return children.find(child => child[field] === value);
        }

        if (typeof field === 'object') {
            return children.find(matchFilters(field));
        }

        return children;
    }

    getAll (field, value) {
        if (!this.pawns) {
            return;
        }

        const children = this.pawns.getChildren();

        if (typeof field === 'string') {
            return children.filter(child => child[field] === value);
        }

        if (typeof field === 'object') {
            return children.filter(matchFilters(field));
        }

        return children;
    }

    sync ({
        G: {
            pawns
        }
    } = {}) {
        for (const [ id, pawn ] of Object.entries(pawns)) {
            const existingPawn = this.get('id', id);

            if (typeof existingPawn !== 'undefined' || this.deceased.indexOf(id) > -1) {
                continue;
            }

            this.add({
                ...pawn,
                id
            });
        }
    }

}

const matchFilters = filters => item => Object
    .entries(filters)
    .every(([ key, val ]) => item[key] === val);
