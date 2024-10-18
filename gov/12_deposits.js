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
  const [deposits, pageResponse] = await gov.deposits(proposalId, pageRequest);
  for (const deposit of deposits) {
    console.log('deposit:', deposit.toObject(true));
  }
  console.log('pageResponse:', pageResponse.toObject(true));
};

main();
