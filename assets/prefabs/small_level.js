// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        spStars: [cc.Sprite],
        spLock: cc.Sprite,
        starCount: 1, //-1表示未解锁，0表示0星
        levelIndxe: 0, //关卡数

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

        this.updateUI();
    },
    setLelve(args) {
        this.starCount = args.starCount;
        this.levelIndxe = args.levelIndxe;

    },
    updateUI() {
        if (this.starCount < 0) {
            this.spLock.node.active = true;
            this.node.off(cc.Node.EventType.TOUCH_END, () => {
                cc.director.loadScene('game');
            });
        } else {
            this.spLock.node.active = false;
            this.node.on(cc.Node.EventType.TOUCH_END, () => {
                cc.director.loadScene('game');
            });
        }
        for (let i = 0; i < this.spStars.length; i++) {
            if (i < this.starCount) {
                this.spStars[i].node.active = true;
            } else {
                this.spStars[i].node.active = false;
            }
        }
    },

    // update (dt) {},
});