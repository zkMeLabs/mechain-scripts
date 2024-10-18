import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export const main = async () => {
  const { rpc, contracts, govAddress } = await fs.readJSON('../cfg.json');
  const { abi } = await fs.readJSON(path.join(contracts, 'gov/IGov.sol/IGov.json'));
  const provider = new ethers.JsonRpcProvider(rpc);

  // input params
  const privateKey = 'e54bff83fc945cba77ca3e45d69adc5b57ad8db6073736c8422692abecfb5fe2';
  const wallet = new ethers.Wallet(privateKey, provider);
  const gov = new ethers.Contract(govAddress, abi, wallet);

  const proposalId = 1;
  const options = [
    { option: 1, weight: '0.4' },
    { option: 3, weight: '0.6' },
  ]; // 0:Unspecified, 1:Yes, 2: Abstain, 3: No, 4:NoWithWeto
  const metadata = 'hello, use evm tx voteWeighted gov';
  const tx = await gov.voteWeighted(proposalId, options, metadata);
  const receipt = await tx.wait();
  console.log(`vote proposal success, blockNumber: ${receipt.blockNumber}, blockHash: ${receipt.blockHash}`);
};

main();
