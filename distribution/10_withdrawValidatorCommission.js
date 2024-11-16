import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export const main = async () => {
  const { rpc, contracts, distributionAddress } = await fs.readJSON('../cfg.json');
  const { abi } = await fs.readJSON(path.join(contracts, 'distribution/IDistribution.sol/IDistribution.json'));

  const privateKey = 'e54bff83fc945cba77ca3e45d69adc5b57ad8db6073736c8422692abecfb5fe2';
  const provider = new ethers.JsonRpcProvider(rpc);
  const wallet = new ethers.Wallet(privateKey, provider);

  // input params
  const distribution = new ethers.Contract(distributionAddress, abi, wallet);

  const tx = await distribution.withdrawValidatorCommission();
  const receipt = await tx.wait();
  console.log('withdrawValidatorCommission receipt: ', JSON.stringify(receipt, undefined, 2));
};

main();
