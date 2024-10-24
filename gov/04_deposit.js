import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export const main = async () => {
  const { rpc, contracts, govAddress, denom } = await fs.readJSON('../cfg.json');
  const { abi } = await fs.readJSON(path.join(contracts, 'gov/IGov.sol/IGov.json'));
  const provider = new ethers.JsonRpcProvider(rpc);

  // input params
  const privateKey = 'f78a036930ce63791ea6ea20072986d8c3f16a6811f6a2583b0787c45086f769';
  const wallet = new ethers.Wallet(privateKey, provider);
  const gov = new ethers.Contract(govAddress, abi, wallet);

  const proposalId = 1;
  const amount = ethers.Typed.uint256('1000000000000000000');
  const tx = await gov.deposit(proposalId, amount);
  const receipt = await tx.wait();
  console.log(`deposit proposal success, blockNumber: ${receipt.blockNumber}, blockHash: ${receipt.blockHash}`);
};

main();
