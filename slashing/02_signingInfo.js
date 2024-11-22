import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export const main = async () => {
  const { rpc, contracts, slashingAddress } = await fs.readJSON('../cfg.json');
  const { abi } = await fs.readJSON(path.join(contracts, 'slashing/ISlashing.sol/ISlashing.json'));
  const provider = new ethers.JsonRpcProvider(rpc);

  // input params
  const consAddress = '0x770D0E0C8C7464D68CF052E4627D315F18037F2C';

  const slashing = new ethers.Contract(slashingAddress, abi, provider);
  const valSigningInfo = await slashing.signingInfo(consAddress);
  console.log('valSigningInfo', JSON.stringify(valSigningInfo.toObject(true), undefined, 2));
};

main();
