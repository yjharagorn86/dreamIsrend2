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
        items: [cc.Node],
        prefab: cc.Prefab,
        curIndex: 0,
        itemsCount: 3,
        offx: 100,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        for (var i = 0; i < this.itemsCount; i++) {
            this.items[i] = cc.instantiate(this.prefab);
            this.items[i].parent = this.node;
            var leveljs = this.items[i].getComponent('level');
            leveljs.setLevle(i);
            this.items[i].setPositionX(this.offx * i);
            if (i == this.itemsCount - 1) {
                this.items[i].setPositionX(-this.offx);
            }
            if (i != 0) {
                this.items[i].setScale(0.8, 0.8);
            }
        }

    },
    moveForward() {
        if (this.curIndex == this.itemsCount - 1) {
            this.curIndex = 0;
        } else {
            this.curIndex++;
        }
        let preIndex = (this.curIndex - 1 + this.itemsCount) % this.itemsCount;
        let nextIndex = (this.curIndex + 1 + this.itemsCount) % this.itemsCount;
        for (let i = 0; i < this.itemsCount - 1; i++) {
            if(i == this.curIndex){
                this.items[i].setScale(0.8, 0.8);
                this.items[i].active=true;
                this.items[i].zIndex = 2;

                // this.items[i].setPositionX(-1*this.offx);
            }
            else if( i == preIndex){
                this.items[i].setScale(0.8, 0.8);
                this.items[i].active=true;
                this.items[i].zIndex = 1;

            }
            else if(i==nextIndex){
                this.items[i].active=true;
                this.items[i].zIndex = 0;

            }
            else{
                this.items[i].active=false;
            }
        }
        this.items[this.curIndex].runAction(cc.spawn(cc.moveTo(0.2,cc.p(0, 0)),cc.scaleTo(0.2,1)));
        this.items[preIndex].runAction(cc.spawn(cc.moveTo(0.2,cc.p(-this.offx, 0)),cc.scaleTo(0.2,0.8)));
        this.items[nextIndex].runAction(cc.spawn(cc.moveTo(0.2,cc.p(this.offx, 0)),cc.scaleTo(0.2,0.8)));

    },
    moveBack() {
        if (this.curIndex == 0) {
            this.curIndex = this.itemsCount - 1;
        } else {
            this.curIndex--;
        }
        let preIndex = (this.curIndex +1 + this.itemsCount) % this.itemsCount;
        let nextIndex = (this.curIndex - 1 + this.itemsCount) % this.itemsCount;
        for (let i = 0; i < this.itemsCount - 1; i++) {
            if(i == this.curIndex){
                this.items[i].setScale(0.8, 0.8);
                this.items[i].active=true;
                this.items[i].zIndex = 2;

                // this.items[i].setPositionX(-2*this.offx);
            }
            else if( i == preIndex){
                this.items[i].setScale(0.8, 0.8);
                this.items[i].active=true;
                this.items[i].zIndex = 1;

            }
            else if(i==nextIndex){
                this.items[i].active=true;
                this.items[i].zIndex = 0;
            }
            else{
                this.items[i].active=false;
            }
        }
        this.items[this.curIndex].runAction(cc.spawn(cc.moveTo(0.2,cc.p(0, 0)),cc.scaleTo(0.2,1)));
        this.items[preIndex].runAction(cc.spawn(cc.moveTo(0.2,cc.p(-this.offx, 0)),cc.scaleTo(0.2,0.8)));
        this.items[nextIndex].runAction(cc.spawn(cc.moveTo(0.2,cc.p(this.offx, 0)),cc.scaleTo(0.2,0.8)));
    },
    start() {

    },

    // update (dt) {},
});