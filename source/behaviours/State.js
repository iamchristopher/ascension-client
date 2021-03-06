export default class {

    constructor(target) {
        this.target = target;

        this.graphics = target.scene.add.graphics(0, 0);

        this.onEnter();
    }

    onEnter () {
        return console.log(`${this.target.id} - Enter ${this.constructor.name}`);
    }

    execute() {}

    onExit() {
        return console.log(`${this.target.id} - Exit ${this.constructor.name}`);
    }

};
