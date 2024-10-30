import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

BigInt.prototype.toJSON = function () {
  return this.toString();
};

/**
 * @description historicalInfo
 * queries the historical info for given height.
 */
export const main = async () => {
  const { rpc, contracts, stakingAddress } = await fs.readJSON('../cfg.json');
  const { abi } = await fs.readJSON(path.join(contracts, 'staking/IStaking.sol/IStaking.json'));
  const provider = new ethers.JsonRpcProvider(rpc);

  // input params
  const height = 10;

  const staking = new ethers.Contract(stakingAddress, abi, provider);
  const historicalInfo = await staking.historicalInfo(height);

  console.log('header:', JSON.stringify(historicalInfo.header.toObject(true), undefined, 2));
  for (let i = 0; i < historicalInfo.valset.length; i++) {
    const validator = historicalInfo.valset[i];
    console.log(`validator ${i + 1}:`, JSON.stringify(validator.toObject(true), undefined, 2));
  }
};

main();
