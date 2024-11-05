import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

BigInt.prototype.toJSON = function () {
  return this.toString();
};

/**
 * @description denomMetadata
 * queries the client metadata of a given coin denomination.
 */
export const main = async () => {
  const { rpc, contracts, bankAddress, denom } = await fs.readJSON('../cfg.json');
  const { abi } = await fs.readJSON(path.join(contracts, 'bank/IBank.sol/IBank.json'));
  const provider = new ethers.JsonRpcProvider(rpc);

  // input params
  const bank = new ethers.Contract(bankAddress, abi, provider);
  const metaData = await bank.denomMetadata(denom);

  console.log(`metaData:`, JSON.stringify(metaData.toObject(true), undefined, 2));
};

main();
