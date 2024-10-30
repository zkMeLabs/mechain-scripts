import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

BigInt.prototype.toJSON = function () {
  return this.toString();
};

/**
 * @description delegatorValidators
 * queries all validators info for given delegator address.
 */
export const main = async () => {
  const { rpc, contracts, stakingAddress } = await fs.readJSON('../cfg.json');
  const { abi } = await fs.readJSON(path.join(contracts, 'staking/IStaking.sol/IStaking.json'));
  const provider = new ethers.JsonRpcProvider(rpc);

  // input params
  const delegatorAddr = '0x00000Be6819f41400225702D32d3dd23663Dd690';
  const pageRequest = {
    key: '0x00',
    offset: 0,
    limit: 100,
    countTotal: true,
    reverse: false,
  };

  const staking = new ethers.Contract(stakingAddress, abi, provider);
  const [validators, pageResponse] = await staking.delegatorValidators(delegatorAddr, pageRequest);
  for (let i = 0; i < validators.length; i++) {
    const validator = validators[i];
    console.log(`validator ${i + 1}:`, JSON.stringify(validator.toObject(true), undefined, 2));
  }

  console.log('pageResponse:', pageResponse.toObject(true));
};

main();
