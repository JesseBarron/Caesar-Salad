"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
exports.caesarCipher = caesarCipher;
var text_encrypter_1 = require("text-encrypter");
Object.defineProperty(exports, "encrypt", { enumerable: true, get: function () { return text_encrypter_1.encrypt; } });
Object.defineProperty(exports, "decrypt", { enumerable: true, get: function () { return text_encrypter_1.decrypt; } });
function caesarCipher(input, options = {}) {
    const { steps = 1, decrypt: shouldDecrypt = false } = options;
    if (shouldDecrypt) {
        return require("text-encrypter").decrypt(input, steps, true);
    }
    else {
        return require("text-encrypter").encrypt(input, steps, true);
    }
}
//# sourceMappingURL=index.js.map