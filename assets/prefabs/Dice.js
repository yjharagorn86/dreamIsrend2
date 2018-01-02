
cc.Class({
    extends: cc.Component,

    properties: {
        // color: 0,
        spriteFrames: [cc.SpriteFrame],
        particleNode:cc.Node,
        _pic: cc.Sprite,
        _num: 1,
        player:cc.Node,
        btnDice:cc.Node,
    },
    start: function () {
        this._timer = 0.0;
    },
    setPlay:function(player){
        this.player = player;
    },
    // use this for initialization
    onLoad: function () {
   
        // this.type = 100;
        this._pic = this.getComponent(cc.Sprite);
        this.node.active = false;
        this.particleNode.active=false;
        this.btnDice=cc.find("Canvas/btn_dice");
        this.nodeMap = cc.find("Canvas/map");
        cc.log(this.btnDice);
        cc.log(this.nodeMap);
        
    },
    // getNum:function(){
    //     this._num= Math.random()*6+1
    //     return this._num;
    // },
    //播放骰子动画
    playAin: function () {
        this.node.active = true;
        var anim = this.getComponent(cc.Animation);
        var animState = anim.getAnimationState("dice")
        animState.wrapMode = cc.WrapMode.Loop;
        animState.speed = 0.5;
        cc.log(anim);
        // anim.play();
        // return;
        
        this.particleNode.active=true;
     
        var visibleSize = cc.director.getVisibleSize()
        cc.log(visibleSize.width / 2)
        this.node.position = new cc.Vec2(visibleSize.width / 2, visibleSize.height / 2);
        cc.log(this.node.position);
        var jumpCount = Math.floor(Math.random() * 3 + 2);
        var pos = Math.floor(Math.random() * 100) + 50 * jumpCount;
        cc.log("jumpCount" + jumpCount);
        var jumpTO1 = cc.jumpTo(0.5, cc.p(pos, pos), 50, 1);
        var actionTo = cc.jumpTo(0.5, cc.p(0, 0), 50, jumpCount);
        var delay = cc.delayTime(0.1);
        var finished = cc.callFunc(function () {
            this._num =  Math.floor(Math.random() * 6) + 1;
            // anim.stop();
            // cc.log(this.spriteFrames);
            this._pic.spriteFrame = this.spriteFrames[this._num - 1];
            this.particleNode.active=false;
            this.btnDice.stopAllActions();
            this.btnDice.scale=1.0;
            // this.btnRightDice.interactable = false;
            // this.btnDice.active = false;
            this.nodeMap.emit('dice_finish', {
                msg:this._num,
              });
        }, this);

        var seq = cc.sequence(jumpTO1, actionTo, delay, finished);
        this.node.stopAllActions();
        this.node.runAction(seq);
        // var action = cc.moveTo(2, 100, 100);

    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});