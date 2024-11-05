import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

BigInt.prototype.toJSON = function () {
  return this.toString();
};

/**
 * @description params
 * queries the parameters of x/bank module.
 */
export const main = async () => {
  const { rpc, contracts, bankAddress } = await fs.readJSON('../cfg.json');
  const { abi } = await fs.readJSON(path.join(contracts, 'bank/IBank.sol/IBank.json'));
  const provider = new ethers.JsonRpcProvider(rpc);

  const bank = new ethers.Contract(bankAddress, abi, provider);
  const params = await bank.params();

  console.log(`params:`, JSON.stringify(params.toObject(true), undefined, 2));
};

main();
