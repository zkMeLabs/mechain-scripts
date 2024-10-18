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
  const pageRequest = {
    key: '0x00',
    offset: 0,
    limit: 100,
    countTotal: true,
    reverse: false,
  };
  const [votes, pageResponse] = await gov.votes(proposalId, pageRequest);
  for (const vote of votes) {
    console.log('vote:', vote.toObject(true));
  }
  console.log('pageResponse:', pageResponse.toObject(true));
};

main();
