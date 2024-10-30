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
  const validatorAddr = '0xbf657d0ef7b48167657a703ed8fd063f075246d7';
  const pageRequest = {
    key: '0x00',
    offset: 0,
    limit: 100,
    countTotal: true,
    reverse: false,
  };

  const staking = new ethers.Contract(stakingAddress, abi, provider);

  const [delegations, pageResponse] = await staking.validatorUnbondingDelegations(validatorAddr, pageRequest);
  for (const delegation of delegations) {
    console.log('delegation', delegation.toObject(true));
  }
  console.log('pageResponse:', pageResponse.toObject(true));
};

main();
