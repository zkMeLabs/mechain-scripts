import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

BigInt.prototype.toJSON = function () {
  return this.toString();
};

// http://127.0.0.1:1317/cosmos/gov/v1/proposals/1
export const main = async () => {
  const { rpc, contracts, govAddress } = await fs.readJSON('../cfg.json');
  const { abi } = await fs.readJSON(path.join(contracts, 'gov/IGov.sol/IGov.json'));
  const provider = new ethers.JsonRpcProvider(rpc);

  // input params
  const gov = new ethers.Contract(govAddress, abi, provider);
  const status = 0;
  const voter = '0x0000000000000000000000000000000000000000';
  const depositor = '0x0000000000000000000000000000000000000000';
  const pageRequest = {
    key: '0x00',
    offset: 0,
    limit: 100,
    countTotal: true,
    reverse: false,
  };

  const [proposals, pageResponse] = await gov.proposals(status, voter, depositor, pageRequest);
  for (const proposal of proposals) {
    console.log('proposal', JSON.stringify(proposal.toObject(true), undefined, 2));
    // console.log(JSON.parse(proposal.toObject(true).messages['_']));
  }
  console.log('pageResponse:', pageResponse.toObject(true));
};

main();
