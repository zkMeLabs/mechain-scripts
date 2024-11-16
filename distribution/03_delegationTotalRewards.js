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
  const delegatorAddress = '0x00000Be6819f41400225702D32d3dd23663Dd690';
  const distribution = new ethers.Contract(distributionAddress, abi, provider);

  const [rewards, total] = await distribution.delegationTotalRewards(delegatorAddress);
  for (const reward of rewards) {
    console.log('reward', JSON.stringify(reward.toObject(true), undefined, 2));
  }
  for (const item of total) {
    console.log('total', JSON.stringify(item.toObject(true), undefined, 2));
  }
};

main();
