window.g_spriteFrames = {};
class ResLoader {
    static loadImg(path, cb) {
        if (window.g_spriteFrames[path]) {
            cb(window.g_spriteFrames[path]);
            return;
        }
        cc.loader.loadRes(path, cc.SpriteFrame, (err, atlas) => {
            if (!err) {
                window.g_spriteFrames[path] = atlas;
                cb(atlas);
            } else {
                cc.log(err);
            }

        });
    }
}
