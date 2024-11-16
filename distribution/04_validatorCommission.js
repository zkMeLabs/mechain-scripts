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
  const validatorAddress = '0xbf657d0ef7b48167657a703ed8fd063f075246d7';
  const distribution = new ethers.Contract(distributionAddress, abi, provider);

  const rewards = await distribution.validatorCommission(validatorAddress);
  for (const reward of rewards) {
    console.log('validatorCommission', JSON.stringify(reward.toObject(true), undefined, 2));
  }
};

main();
