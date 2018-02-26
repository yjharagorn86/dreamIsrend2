

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        nodeHeros: [cc.Node],
    },

    // use this for initialization
    onLoad: function () {
        this.nodeMap = cc.find("Canvas/map");
        this.btnDice = cc.find("Canvas/btn_dice");
    },

    init: function (id) {
        this.heros = []
        for (var index = 0; index < 3; index++) {
            this.nodeHeros[index];
            this.heros[index] = this.nodeHeros[index].getComponent('hero');
            this.heros[index].setHero(id, this);
        }
    },
    judgeUion(hero) {
        for (var index = 0; index < this.heros.length; index++) {
            if (hero == this.heros[index]||!this.heros[index].node.active) {
                continue;
            }
            if (hero.mapPos == this.heros[index].mapPos && !hero.isUnion(this.heros[index])) {
                cc.log(hero.mapPos )
                cc.log(this.heros[index].mapPos )
                hero.union(this.heros[index]);
            }
        }
    },
    disableHero: function () {
        for (var index = 0; index < this.heros.length; index++) {
            this.heros[index].disableClick()
        }
    },

    enableHero: function () {
        for (var index = 0; index < this.heros.length; index++) {
            this.heros[index].enableClick()
        }
    },
    //清除选中总
    clearChoices() {
        cc.log(this.heros)
        for (var index = 0; index < this.heros.length; index++) {
            this.heros[index].isChoise = false;
        }
    },
    getChoiceHero() {
        for (var index = 0; index < this.heros.length; index++) {
            if (this.heros[index].isChoise == true) {
                return this.heros[index];
            }
        }
        return null;
    },
    getHeroByPos(pos) {
        if (pos < 0) {
            cc.log("pos 为-1 无意义")
            return null;
        }
        for (var index = 0; index < this.heros.length; index++) {
            if (this.heros[index].mapPos == pos) {
                return this.heros[index];
            }
        }
    },
    turnToChoice: function () {
        this.clearChoices();
        this.enableHero();
        //轮到我投
        // this.heroNodes.forEach(function (element) {
        //     var btn = element.getComponent(cc.Button);
        //     btn.interactable = false;
        // }, this);
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});