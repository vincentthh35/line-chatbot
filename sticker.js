import sticker from './document/sticker.json';

const genStickerMessage = (sticker) => {
    return {
        type: 'sticker',
        stickerId: sticker.stickerId,
        packageId: sticker.packageId
    }
}

const randomSticker = () => {
    let keys = Object.keys(sticker);
    return sticker[ keys[ keys.length * Math.random() << 0 ] ];
}

export default sticker;

export { genStickerMessage, randomSticker }
