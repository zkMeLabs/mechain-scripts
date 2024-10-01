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
  const privateKey = 'e54bff83fc945cba77ca3e45d69adc5b57ad8db6073736c8422692abecfb5fe2';
  const wallet = new ethers.Wallet(privateKey, provider);
  const gov = new ethers.Contract(govAddress, abi, wallet);

  const title = 'Text Proposal';
  const description = 'Just Test Proposal';
  const initialDeposit = [
    {
      denom,
      amount: '1000000000000000000',
    },
  ];

  const tx = await gov.legacySubmitProposal(title, description, initialDeposit);
  const receipt = await tx.wait();
  console.log('legacy submit proposal success, receipt: ', receipt);
};

main();
