import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

BigInt.prototype.toJSON = function () {
  return this.toString();
};

/**
 * @description pool
 * queries the pool info.
 */
export const main = async () => {
  const { rpc, contracts, stakingAddress } = await fs.readJSON('../cfg.json');
  const { abi } = await fs.readJSON(path.join(contracts, 'staking/IStaking.sol/IStaking.json'));
  const provider = new ethers.JsonRpcProvider(rpc);

  const staking = new ethers.Contract(stakingAddress, abi, provider);
  const pool = await staking.pool();

  console.log('pool:', JSON.stringify(pool.toObject(true), undefined, 2));
};

main();
