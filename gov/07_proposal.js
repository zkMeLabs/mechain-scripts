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
  const gov = new ethers.Contract(govAddress, abi, provider);
  const proposalId = 1;
  const proposal = await gov.proposal(proposalId);
  console.log('proposal:', proposal.toObject(true));
};

main();
