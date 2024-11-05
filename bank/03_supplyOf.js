import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

BigInt.prototype.toJSON = function () {
  return this.toString();
};

/**
 * @description supplyOf
 * queries the supply of a single coin.
 */
export const main = async () => {
  const { rpc, contracts, bankAddress, denom } = await fs.readJSON('../cfg.json');
  const { abi } = await fs.readJSON(path.join(contracts, 'bank/IBank.sol/IBank.json'));
  const provider = new ethers.JsonRpcProvider(rpc);

  // input params

  const bank = new ethers.Contract(bankAddress, abi, provider);
  const coin = await bank.supplyOf(denom);

  console.log(`coin:`, JSON.stringify(coin.toObject(true), undefined, 2));
};

main();
