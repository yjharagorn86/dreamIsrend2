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
        _playingIndex: 0,
        _countinue: 0,
        _turnCount: 0, //回合数
        _killCount: 0, //
        _dieCount: 0, //
        _callCount: 0, //
        labTurnCount: cc.Label,
        labKillCount: cc.Label,
        labDieCount: cc.Label,
        labCallCount: cc.Label,
        imgStars:[cc.Sprite],
    },

    // use this for initialization
    onLoad() {
        cc._initDebugSetting(cc.DebugMode.INFO);

        this.btnDice = cc.find("Canvas/btn_dice");
        this._players[0] = cc.find("player_my", this.node).getComponent('player');
        this._players[1] = cc.find("player_enemy", this.node).getComponent('player');
        this.labTurnCount = cc.find("top_tip/lab_turn/lab_count", this.node).getComponent('cc.Label');
        this.labKillCount = cc.find("top_tip/lab_kill/lab_count", this.node).getComponent('cc.Label');
        this.labDieCount = cc.find("top_tip/lab_die/lab_count", this.node).getComponent('cc.Label');
        this.labCallCount = cc.find("top_tip/lab_call/lab_count", this.node).getComponent('cc.Label');
        cc.log(this.imgStars);
        if(this.imgStars.length == 0){
            for(var i =0;i<3;i++){
                this.imgStars[i] = cc.find('top_tip/play_img_starbg_'+(i+1)+'/play_img_star', this.node).getComponent(cc.Sprite);
                this.imgStars[i].node.active = false;
            }
        }
    
        //添加监听
        this.node.on('dice_finish', this.onDiceFinish, this);
        this.node.on('player_move', this.onPlayerMove, this);
        this.circleStep = [8, 24];
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
            // sprite.spriteFrame = this.floorSpriteFrames[0];
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
        this.initData();
    },
    initData(){
        this._players[0].init(1);
        this._players[1].init(2);
        this._players[1].isAuto = true;

        this._playingIndex = 0;
        this._countinue = 0;
        this._turnCount = 0; //回合数
        this._killCount = 0; //
        this._dieCount = 0; //
        this._callCount = 0; //
        this.labTurnCount.string = '0';
        this.labDieCount.string = '0';
        this.labCallCount.string = '0';
        this.labKillCount.string = '0';
        for(var i =0;i<3;i++){
            this.imgStars[i].node.active = false;
        }
    },
    onDiceFinish(event) {
        //投到的点数，如果是6的话还可以再投一次
        this.step = event.detail.msg;
        if (this.step == 6) {
            this._countinue = 1;
        }
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
            hero.mapPos = hero.beginPos;
            var jumpTo = cc.jumpTo(0.5, this.positions[hero.beginPos], 20, 1);
            hero.node.runAction(jumpTo);
        }
        //判断是否到达终点
        if (hero.beginPos == 20) {
            // 到达终点

            return;
        }
        //判断是否可以合体
        var player = this.getCurPlayer();
        player.judgeUion(hero);
        //判断有没有东西可以吃
        //判断有没有敌人，有则直接杀
        if (this.judegeKill(hero, hero.mapPos) || this._countinue != 0) {
            this.onTurnStart();
            //成功击杀
            //可以继续投一次
            // this.btnDice.getComponent(cc.Button).interactable = true;
            return;
        }

        //判断是否回合结束,
        this.onTurnOver()



    },
    onTurnStart() {
        this._countinue > 0 ? --this._countinue : this._countinue;
        var player = this.getCurPlayer();
        if (player.seatID == 1) {
            this.btnDice.getComponent(cc.Button).interactable = true;
        }
        player.turnToDice();
    },
    onTurnOver() {
        //展示回合结束
        var player = this.getCurPlayer();
        player.disableHero();
        player.clearChoices();
        this._playingIndex = (++this._playingIndex) % this._players.length;
        player = this.getCurPlayer();
        //轮到新的人投
        this.doDelayFun(this.onTurnStart, 1);
    },
    //延迟调用
    doDelayFun(callback, delayTime) {
        cc.director.getScheduler().schedule(callback, this, 0, 0, delayTime, false);
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
        beginPos = this.getNextStepPos(beginPos, stepDirection);

        hero.beginPos = beginPos;
        stepDirection = this.judgeMove(hero, beginPos, stepDirection);
        cc.log("跳跃方向");
        cc.log(stepDirection);
        var jumpTo = cc.jumpTo(0.5, this.positions[beginPos], 20, 1);
        var callback = cc.callFunc(function (target, args) {
            this.jumpByStep(hero, args[0], args[1]);
        }, this, [moveSteps - 1, stepDirection]);
        hero.node.runAction(cc.sequence(jumpTo, callback));
    },
    calStopPos(hero, moveSteps) {
        if (hero.getState() == EnumHeroState.SUCCESS)
            return -1;
        //暂时不考虑阻路的道具
        var pos = hero.mapPos;

        var step = 1;
        for (var index = 0; index < moveSteps; index++) {
            pos = this.getNextStepPos(pos, step);
            if (this.judgeObstacle(pos)) {
                return pos;
            }
            step = this.judgeMove(hero, pos, step);

        }
        if (pos == 7) {
            pos = 8;
        }
        return pos;
    },
    //获取下一步的位置
    getNextStepPos(pos, step) {
        var circleIndex = this.getCircleIndex(pos);
        var steps = this.circleStep[circleIndex];
        pos = (pos + step + steps) % steps;
        if (pos == 0 && circleIndex == 1) {
            pos = 8;
        }
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
            if (other.unions.length > hero.unions.length) {
                return -step;
            }
        }
        return step;
    },
    //判断是否可以杀人
    judegeKill(hero, pos) {
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
            if (other.unions.length <= hero.unions.length) {
                other.die();
                this._countinue = 1;
                return true;
            } else {
                hero.die();
                this._countinue = 0;
            }
        }
        return false;
    },
    initPlayer() {

    },
    createItem() {

    },

    // called every frame, uncomment this function to activate update callback
    // update (dt) {

    // },
});