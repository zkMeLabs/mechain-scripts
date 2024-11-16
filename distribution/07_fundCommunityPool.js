import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export const main = async () => {
  const { rpc, contracts, distributionAddress, denom } = await fs.readJSON('../cfg.json');
  const { abi } = await fs.readJSON(path.join(contracts, 'distribution/IDistribution.sol/IDistribution.json'));

  const privateKey = 'f78a036930ce63791ea6ea20072986d8c3f16a6811f6a2583b0787c45086f769';
  const provider = new ethers.JsonRpcProvider(rpc);
  const wallet = new ethers.Wallet(privateKey, provider);

  // input params
  const amount = [
    {
      amount: '50000000000000000000',
      denom,
    },
  ];
  const distribution = new ethers.Contract(distributionAddress, abi, wallet);

  const tx = await distribution.fundCommunityPool(amount);
  const receipt = await tx.wait();
  console.log('fundCommunityPool receipt: ', JSON.stringify(receipt, undefined, 2));
};

main();
