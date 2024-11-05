import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export const main = async () => {
  const { rpc, contracts, bankAddress } = await fs.readJSON('../cfg.json');
  const { abi } = await fs.readJSON(path.join(contracts, 'bank/IBank.sol/IBank.json'));
  const provider = new ethers.JsonRpcProvider(rpc);

  // input params
  let res;
  const bank = new ethers.Contract(bankAddress, abi, provider);

  res = await bank.totalSupply();
  console.log('totalSupply', JSON.stringify(res.toObject(true), undefined, 2));
};

main();
