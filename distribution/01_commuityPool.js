import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export const main = async () => {
  const { rpc, contracts, distributionAddress } = await fs.readJSON('../cfg.json');
  const { abi } = await fs.readJSON(path.join(contracts, 'distribution/IDistribution.sol/IDistribution.json'));
  const provider = new ethers.JsonRpcProvider(rpc);

  // input params
  const distribution = new ethers.Contract(distributionAddress, abi, provider);

  const rewards = await distribution.communityPool();
  for (const reward of rewards) {
    console.log('reward', JSON.stringify(reward.toObject(), undefined, 2));
  }
};

main();
