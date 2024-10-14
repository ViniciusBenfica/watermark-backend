export default interface CrypterInterface {
  crypter(text: string): string;
  compare(text: string, hash: string): boolean;
}
