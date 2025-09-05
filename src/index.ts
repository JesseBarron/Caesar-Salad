export { encrypt, decrypt } from "text-encrypter";

// Re-export main functionality for programmatic use
export interface CaesarOptions {
  steps?: number;
  decrypt?: boolean;
}

export function caesarCipher(input: string, options: CaesarOptions = {}): string {
  const { steps = 1, decrypt: shouldDecrypt = false } = options;
  
  if (shouldDecrypt) {
    return require("text-encrypter").decrypt(input, steps, true);
  } else {
    return require("text-encrypter").encrypt(input, steps, true);
  }
}