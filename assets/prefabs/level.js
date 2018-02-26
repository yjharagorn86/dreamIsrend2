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
        spBg:cc.Sprite,
        spLock:cc.Sprite,
        levelImages:[cc.SpriteFrame],
        _level:0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.spBg = this.node.getComponent(cc.Sprite);
        this.spLock = cc.find('lock',this.node).getComponent(cc.Sprite);
        this.node.on(cc.Node.EventType.TOUCH_END,()=>{
            cc.director.loadScene('select');
        });
    },
    setLevle(level){
        this._level = level;
        this.spBg.spriteFrame = this.levelImages[level%2];
    },
    setUnlock(){
        this.spLock.node.active = false;
    },
    start () {
        this.setUnlock();
    },

    // update (dt) {},
});
