//var __atlases = {'Pokers':null,'PlayerTx':null};
var spriteFrames = {};

class ResLoader {

    // static getHeroFrame(key,cb){
    //     ResLoader._loadImg('hero/'+key,cb);
    // }

    // static loadPlayerHeadFrame(key,cb){
    //     ResLoader.__loadImg('images/touxiang/t'+(key%6),cb);
    // }

    // static loadBidFrame(bid,cb){
    //     ResLoader.__loadImg('images/bid/bid'+bid,cb);
    // }
    // static loadActionFrame(act,cb){
    //     ResLoader.__loadImg('images/action/'+act,cb);
    // }

    // static loadIconFrame(icon,cb){
    //     ResLoader.__loadImg('images/icon/'+icon,cb);
    // }

    static loadImg(path, cb) {
        if (spriteFrames[path]) {
            cb(spriteFrames[path]);
            return;
        }
        cc.loader.loadRes(path, cc.SpriteFrame, (err, atlas) => {
            if (!err) {
                spriteFrames[path] = atlas;
                cb(atlas);
            } else {
                cc.log(err);
            }

        });
    }

    //从资源pukepai里读取牌面对应的文件名
    // static getFrameNameByFace(p){
    //     if(!p)
    //         return 'klbp_pukep_00';
    //     if(p[0]=="小")
    //         return 'klbp_pukep_53';
    //     if(p[0]=="大")
    //         return 'klbp_pukep_54';
    //     var faces = '方梅红黑小大';
    //     var cards = 'A23456789TJQK';
    //     var num = (13*faces.indexOf(p[0]) + cards.indexOf(p[1])+1); 
    //     return 'klbp_pukep_' + ('0'.repeat(2)+num).slice(-2);
    // }

}
module.exports = ResLoader;