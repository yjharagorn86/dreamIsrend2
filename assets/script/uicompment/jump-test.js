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
        jumpheight: 100,
        btnTest:cc.Node,
        // btnTest: {
        //     default: null,
        //     type: cc.Node
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
    },

    start() {
        this.node.position = cc.p(-100, 0);
        // this.jump();
        cc.log('你好');
        cc.log(this.btnTest);
        // btn.active = false;
        
        // this.btnTest.active = false;
    },
    jump:function(){

    },
    jump() {
        cc.log(this.node);

        
        var jump = cc.jumpTo(1.0, cc.p(0, 0), this.jumpheight, 1);
        var callback = cc.callFunc(() => {
            cc.log('我回来拉！');
            // this.node.scaleY = 1.0;
            // this.node.position = cc.p(-200, 0);  
            // this.node.stopAllActions();
            // this.node.runAction(cc.scaleTo(0.2, 1, 1));
        });
    
        var scale = cc.scaleTo(0.5, 1, 1);
        var scale2 = cc.scaleTo(0.5, 1, 0.8);
        var seq = cc.sequence(scale,scale2,callback);
        this.node.runAction(cc.repeatForever(cc.spawn(jump,seq)));
    }

    // update (dt) {},
});
