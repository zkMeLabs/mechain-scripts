import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export const main = async () => {
  const { rpc, contracts, stakingAddress } = await fs.readJSON('../cfg.json');
  const { abi } = await fs.readJSON(path.join(contracts, 'staking/IStaking.sol/IStaking.json'));
  const provider = new ethers.JsonRpcProvider(rpc);

  // input params
  const validatorAddress = '0xbf657d0ef7b48167657a703ed8fd063f075246d7';

  const staking = new ethers.Contract(stakingAddress, abi, provider);
  const validator = await staking.validator(validatorAddress);
  console.log('validator', JSON.stringify(validator.toObject(true), undefined, 2));
};

main();
