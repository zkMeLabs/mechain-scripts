import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

BigInt.prototype.toJSON = function () {
  return this.toString();
};

/**
 * @description denomOwners
 * queries for all account addresses that own a particular token denomination.
 */
export const main = async () => {
  const { rpc, contracts, bankAddress, denom } = await fs.readJSON('../cfg.json');
  const { abi } = await fs.readJSON(path.join(contracts, 'bank/IBank.sol/IBank.json'));
  const provider = new ethers.JsonRpcProvider(rpc);

  // input params
  const pageRequest = {
    key: '0x00',
    offset: 0,
    limit: 100,
    countTotal: true,
    reverse: false,
  };

  const bank = new ethers.Contract(bankAddress, abi, provider);
  const [denomOwners, pageResponse] = await bank.denomOwners(denom, pageRequest);
  for (let i = 0; i < denomOwners.length; i++) {
    const denomOwner = denomOwners[i];
    console.log(`denomOwner ${i + 1}:`, JSON.stringify(denomOwner.toObject(true), undefined, 2));
  }

  console.log('pageResponse:', pageResponse.toObject(true));
};

main();
