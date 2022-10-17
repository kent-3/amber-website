import { bech32 } from 'bech32';
import { Buffer } from 'buffer/';

export function bech32ToBytes(address: string): string {
    const bytes = bech32.fromWords(bech32.decode(address).words);
    const buf = Buffer.from(bytes);
    const newKey = "0x" + buf.toString("hex");
    return newKey;
}