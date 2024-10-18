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
  const depositor = ethers.Typed.address('0xbf657D0ef7b48167657A703Ed8Fd063F075246D7');
  const deposit = await gov.deposit(proposalId, depositor);
  console.log('deposit:', deposit.toObject(true));
};

main();
