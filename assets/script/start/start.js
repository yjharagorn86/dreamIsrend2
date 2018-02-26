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
        btn_start:cc.Button
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // this.node.
        this.btn_start = cc.find('Canvas/btn_start').getComponent(cc.Button);
        this.sp_notice = cc.find('sp_notice');
        this.btn_start.node.on('click',()=>{
            cc.log('点击');
            this.node.runAction(cc.sequence(cc.fadeOut(1.0),cc.callFunc(function(){
                cc.director.loadScene('home',()=>{
                    cc.log('跳转完成');
                });
                })));
         
        });
    },

    start () {
        this.node.setOpacity(0);
        // // this.node.runAction(cc.fadeIn(1.0));
        // // this.sp_notice.setOpacity(0);
        // this.sp_notice.runAction(cc.sequence(cc.delayTime(3.0),cc.fadeOut(1.0),cc.callFunc(()=>{
        //     cc.log('okkk');
        // })));
        // // cc.log(this.btn_start);
    },

    // update (dt) {},
});
