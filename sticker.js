import sticker from './document/sticker.json';

const chooseOne = (o) => {
    if (!o) {
        // wrong key
        return randomSticker();
    }
    let keys = Object.keys(o);
    return o[ keys[keys.length * Math.random() << 0] ];
}

const genStickerMessage = (sticker) => {
    if (typeof sticker === "string") {
        const s = randomStickerFromCategory(sticker);
        if (!s) {
            // should not happen
            // chooseOne always return a valid sticker
            return genStickerMessage(randomSticker());
        }
        return genStickerMessage(randomStickerFromCategory(sticker));
    }
    return {
        type: 'sticker',
        stickerId: sticker.stickerId,
        packageId: sticker.packageId
    }
}

const randomSticker = () => {
    let category = chooseOne(sticker);
    return chooseOne(category);
}

const randomStickerFromCategory = (category) => {
    if (typeof category === "string") {
        // access category via sticker[category]
        return chooseOne(sticker[category]);
    } else {
        // category is an object
        return chooseOne(category);
    }
}

export default sticker;

export { genStickerMessage, randomSticker, randomStickerFromCategory }
