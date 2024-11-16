import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export const main = async () => {
  const { rpc, contracts, distributionAddress } = await fs.readJSON('../cfg.json');
  const { abi } = await fs.readJSON(path.join(contracts, 'distribution/IDistribution.sol/IDistribution.json'));

  const privateKey = 'f78a036930ce63791ea6ea20072986d8c3f16a6811f6a2583b0787c45086f769';
  const provider = new ethers.JsonRpcProvider(rpc);
  const wallet = new ethers.Wallet(privateKey, provider);

  // input params
  const validatorAddress = '0xbf657d0ef7b48167657a703ed8fd063f075246d7';
  const distribution = new ethers.Contract(distributionAddress, abi, wallet);

  const tx = await distribution.withdrawDelegatorReward(validatorAddress);
  const receipt = await tx.wait();
  console.log('withdrawDelegatorReward receipt: ', JSON.stringify(receipt, undefined, 2));
};

main();
