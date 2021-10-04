export const betName = (num: number): string => (num ? "HAN" : "CHO");
export const betResult = (expected: number, result: number): string =>
  expected == result ? "WIN" : "LOSE";
export const etherscanLink = (address: string): string =>
  `https://rinkeby.etherscan.io/address/${address}`;
