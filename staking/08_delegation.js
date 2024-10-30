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
  const delegatorAddr = '0x00000Be6819f41400225702D32d3dd23663Dd690';
  const validatorAddr = '0xbf657d0ef7b48167657a703ed8fd063f075246d7';

  const staking = new ethers.Contract(stakingAddress, abi, provider);
  const res = await staking.delegation(delegatorAddr, validatorAddr);
  console.log('delegation', JSON.stringify(res.toObject(true), undefined, 2));
};

main();
