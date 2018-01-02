
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
        floorSpriteFrames: [cc.SpriteFrame],
        _players: [],
        _playingIndex: 0
    },

    // use this for initialization
    onLoad() {
        this.btnDice = cc.find("Canvas/btn_dice");
        this._players[0] = cc.find("player_my", this.node).getComponent('player');
        this._players[1] = cc.find("player_enemy", this.node).getComponent('player');
        //添加监听
        this.node.on('dice_finish', this.onDiceFinish, this);
        this.node.on('player_move', this.onPlayerMove, this);
        cc.log("杨江辉");
        cc.log(HeroState.HOME);
        cc.log(HeroState);
        
        this.circleStep = [8, 16];
        return;
        //地图位置
        this.positions = [];
        let pos = []
        for (var i = 0; i < 5; i++)
            for (var j = 0; j < 5; j++) {
                pos[5 * i + j] = cc.p(-208 + j * 104, -238 + i * 104);
            }
        var indexs = [10, 9, 8, 23, 22, 11, 0, 7, 6, 21, 12, 1, 24, 5, 20, 13, 2, 3, 4, 19, 14, 15, 16, 17, 18];
        for (var i = 0; i < 25; i++) {
            this.positions[indexs[i]] = pos[i];
        }
        var floor = cc.find("floor", this.node);
        cc.log(floor);
        for (var index = 0; index < 25; index++) {
            var node = new cc.Node("floor");
            var sprite = node.addComponent(cc.Sprite);
            sprite.spriteFrame = this.floorSpriteFrames[0];
            node.position = this.positions[index];
            node.parent = floor;
            // node.zIndex=-1;
            if (index != 24) {
                var nodeFoolr = new cc.Node("floor");
                var sprite2 = nodeFoolr.addComponent(cc.Sprite);
                if (index == 0) {
                    sprite2.spriteFrame = this.floorSpriteFrames[4];
                } else if (index == 20) {
                    sprite2.spriteFrame = this.floorSpriteFrames[3];
                } else if (index == 7) {
                    sprite2.spriteFrame = this.floorSpriteFrames[6];
                } else if (index == 8) {
                    sprite2.spriteFrame = this.floorSpriteFrames[5];
                } else if (index > 8) {
                    sprite2.spriteFrame = this.floorSpriteFrames[1];
                } else {
                    sprite2.spriteFrame = this.floorSpriteFrames[2];
                }
                nodeFoolr.position = this.positions[index];
                nodeFoolr.parent = floor;
            }
        }



    },
    start() {
        // this._players[0].init(2);
        // this._players[1].init(1);
    },
    onDiceFinish(event) {
        // this.btnRightDice.interactable = false;
        this.step = event.detail.msg;
        this.btnDice.getComponent(cc.Button).interactable = false;
        cc.log(this._players[this._playingIndex]);
        var player = this.getCurPlayer();
        // console.log(player);
        player.turnToChoice();
        this.hadMove = false;
        this.hadKill = false;
        this.hadJump = false;
        this.showTip("选择你要移动的飞龙")

    },
    onPlayerMove() {
        var player = this.getCurPlayer();
        var hero = player.getChoiceHero();

        var stopPos = this.calStopPos(hero, this.step);
        cc.log("stopPos:" + stopPos);
        hero.beginPos = hero.mapPos;
        hero.mapPos = stopPos;
        this.moveTo(hero, this.step)
    },
    onMoveStop(hero, moveSteps) {
        //判断是否可以起飞
        if (hero.beginPos == 7) {
            hero.beginPos++;
            var jumpTo = cc.jumpTo(0.5, this.positions[hero.beginPos], 20, 1);
            hero.node.runAction(jumpTo);
        }
        //判断有没有东西可以吃
        //判断有没有敌人，有则直接杀

        //判断是否可以合体
        var player = this.getCurPlayer();
        player.judgeUion(hero);
        this.btnDice.getComponent(cc.Button).interactable = true;


    },
    showTip(str) {

    },
    moveTo(hero, moveSteps) {
        this.jumpByStep(hero, moveSteps, 1);

    },
    jumpByStep(hero, moveSteps, stepDirection) {
        var beginPos = hero.beginPos;
        if (moveSteps == 0) {
            this.onMoveStop(hero, beginPos);
            return;
        }
        //判断是否有障碍物
        if (this.judgeObstacle(beginPos) && hero.mapPos !== beginPos) {
            this.onMoveStop(hero, beginPos);
            return;
        }
        cc.log("跳跃前" + beginPos);
        beginPos = this.getNextStepPos(beginPos, stepDirection);
        cc.log("跳跃后" + beginPos);
        hero.beginPos = beginPos;
        stepDirection = this.judgeMove(hero, beginPos, stepDirection);
        var jumpTo = cc.jumpTo(0.5, this.positions[beginPos], 20, 1);
        var callback = cc.callFunc(function (target, args) {
            this.jumpByStep(hero, args[0], args[1]);
        }, this, [moveSteps - 1, stepDirection]);
        hero.node.runAction(cc.sequence(jumpTo, callback));
    },
    calStopPos(hero, moveSteps) {
        if (hero.getState() == HeroState.SUCCESS)
            return -1;
        //暂时不考虑阻路的道具
        var pos = hero.mapPos;

        var step = 1;
        for (var index = 0; index < moveSteps; index++) {
            pos = this.getNextStepPos(pos, step);
            if (this.judgeObstacle(pos)) {
                return pos;
            }
            cc.log(pos)

            step = this.judgeMove(hero, pos, step);

            cc.log(pos)
        }
        if (pos == 7) {
            pos = 8;
        }
        return pos;
    },
    //获取下一步的位置
    getNextStepPos(pos, step) {

        if (pos < 0) {
            pos = pos + this.circleStep[0];
        } else {
            circleIndex = this.getCircleIndex(pos);
        }
        var steps = this.circleStep[circleIndex]+lastCircleStep;
        cc.log("lastCircleStep" + lastCircleStep);
        pos = (pos + step) % steps
        if(pos<lastCircleStep){
            pos+=lastCircleStep;
        }
        cc.log(pos)

        return pos;
    },
    getCircleIndex(pos) {
        if (pos < 8) {
            return 0;
        } else
            return 1;
    },
    getCurPlayer() {
        // cc.log()
        return this._players[this._playingIndex];
    },
    judgeObstacle(pos) {
        //todo 对于障碍物进行判断
        // if (pos == 0) {
        //     return true;
        // }
        return false;
    },
    //碰到叠机数量大于自己的时候要往后退
    judgeMove(hero, pos, step) {
        if (pos < 0) {
            return 1;
        }
        for (var tempIndex = 0; tempIndex < this._players.length; tempIndex++) {
            var element = this._players[tempIndex];
            if (element == hero.player) {
                continue;
            }
            cc.log("judgeMove " + pos);
            var other = element.getHeroByPos(pos)
            if (other == null) {
                continue;
            }
            if (other.togetherCount > hero.togetherCount) {
                return -step;
            }
        }
        return step;
    },
    initPlayer() {

    },
    createItem() {

    },

    // called every frame, uncomment this function to activate update callback
    // update (dt) {

    // },
});