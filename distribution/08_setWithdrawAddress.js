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
  const address = '0x1111102dd32160b064f2a512cdef74bfdb6a9f96';
  const distribution = new ethers.Contract(distributionAddress, abi, wallet);

  const tx = await distribution.setWithdrawAddress(address);
  const receipt = await tx.wait();
  console.log('setWithdrawAddress receipt: ', JSON.stringify(receipt, undefined, 2));
};

main();
