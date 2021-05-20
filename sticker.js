import sticker from './document/sticker.json';

const genStickerMessage = (sticker) => {
    return {
        type: 'sticker',
        stickerId: sticker.stickerId,
        packageId: sticker.packageId
    }
}

const chooseOne = (o) => {
    let keys = Object.keys(o);
    return o[ keys[keys.length * Math.random() << 0] ];
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
