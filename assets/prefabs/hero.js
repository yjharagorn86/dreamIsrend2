var resLoader = require('../script/res-loader');
var heroScale = [1.0, 1.2, 1.4]
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
        _state: 0, //0 再家 1出战 2=成功到达
        mapPos: -1,
        _heroid: 1, //根据id生成图片
        spHero: cc.Sprite,
        player: null,
        isChoise: false,
        unions: [],
    },

    // use this for initialization
    onLoad: function () {
        this.map = cc.find("Canvas/map").getComponent("map");
        this.homePosition = this.node.getPosition();
        var self = this;
        this.spHero.node.on('click', function (event) {
            cc.log("click")
            self.player.clearChoices();
            self.isChoise = true;
            var btn = self.spHero.getComponent(cc.Button);
            btn.interactable = false;
            cc.log(self);
            self.map.node.emit("player_move");

        }, this);
        this.disableClick();
    },
    //合体
    union(hero) {
        var beUnion = this;
        var doUnion = hero;
        if (hero.unions.length > this.unions.length) {
            doUnion = hero;
            beUnion = this;
        }
        doUnion.unions.push(beUnion);
        
        beUnion.node.active =false;
        cc.log("合体成功");
        cc.log(doUnion.unions.length)
        doUnion.node.setScale(heroScale[doUnion.unions.length]);
    },
    //判断两者是否是合体的
    isUnion(hero) {
        var beUnion = this;
        var doUnion = hero;
        if (hero.unions.length > this.unions.length) {
            doUnion = hero;
            beUnion = this;
        }
        for (var i = 0; i < doUnion.unions.length; i++) {
            if (hero == doUnion.unions[i]) {
                return true;
            }
        }
        return false;
    },
    enableClick() {
        var btn = this.spHero.getComponent(cc.Button);
        btn.interactable = true;
    },
    disableClick() {
        
        var btn = this.spHero.getComponent(cc.Button);
        btn.interactable = false;
    },

    setHero(id, player) {
        this._state = HeroState.HOME;
        this._heroid = id;
        this.mapPos = -1;
        this.beginPos = -1;
        this.unions=[];
        this._reSetHeroImage();
        if (this.homePosition) {
            this.node.position = this.homePosition;
        }
        this.player = player;
    },

    _reSetHeroImage() {
        var key = 'hero/hero' + this._heroid + '_' + (this._state + 1);
        var self = this;
        resLoader.loadImg(key, function (spriteFrame) {
            self.spHero.spriteFrame = spriteFrame;
        });
    },
    setState(state) {
        if (_state == state) {
            return;
        }
        cc.log('hero setState is ' + _state);
        _state = state;
        this._reSetHeroImage();
    },
    getState() {
        return this._state;
    },
    die(){
        this.mapPos = -1;
        this.unions=[];
        doUnion.node.setScale(1.0);
        this.setState(HeroState.HOME);
        this.jumpTo(1.0,this.homePosition);
    },
    //回家
    backHome() {
        this.mapPos = -1;
        this.unions=[];
        doUnion.node.setScale(1.0);
        this.setState(HeroState.SUCCESS);
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});