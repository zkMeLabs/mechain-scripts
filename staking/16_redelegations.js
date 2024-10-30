import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

BigInt.prototype.toJSON = function () {
  return this.toString();
};

/**
 * @description redelegations
 * queries redelegations of given address.
 */
// case1
export const main1 = async () => {
  const { rpc, contracts, stakingAddress } = await fs.readJSON('../cfg.json');
  const { abi } = await fs.readJSON(path.join(contracts, 'staking/IStaking.sol/IStaking.json'));
  const provider = new ethers.JsonRpcProvider(rpc);

  // input params
  const delegatorAddr = '0x00000Be6819f41400225702D32d3dd23663Dd690';
  const srcValidatorAddr = '0xbf657d0ef7b48167657a703ed8fd063f075246d7';
  const dstValidatorAddr = '0xdeAFEfeAd45B801f7661020469190AA041b2d51F';
  const pageRequest = {
    key: '0x00',
    offset: 0,
    limit: 100,
    countTotal: true,
    reverse: false,
  };

  const staking = new ethers.Contract(stakingAddress, abi, provider);
  const [redelegations, pageResponse] = await staking.redelegations(delegatorAddr, srcValidatorAddr, dstValidatorAddr, pageRequest);
  for (let i = 0; i < redelegations.length; i++) {
    const redelegation = redelegations[i];
    console.log(`redelegation ${i + 1}:`, JSON.stringify(redelegation.toObject(true), undefined, 2));
  }

  console.log('pageResponse:', pageResponse.toObject(true));
};

// case2
export const main2 = async () => {
  const { rpc, contracts, stakingAddress } = await fs.readJSON('../cfg.json');
  const { abi } = await fs.readJSON(path.join(contracts, 'staking/IStaking.sol/IStaking.json'));
  const provider = new ethers.JsonRpcProvider(rpc);

  // input params
  const emptyDelegatorAddr = '0x0000000000000000000000000000000000000000';
  const srcValidatorAddr = '0xbf657d0ef7b48167657a703ed8fd063f075246d7';
  const emptyDstValidatorAddr = '0x0000000000000000000000000000000000000000';
  const pageRequest = {
    key: '0x00',
    offset: 0,
    limit: 100,
    countTotal: true,
    reverse: false,
  };

  const staking = new ethers.Contract(stakingAddress, abi, provider);
  const [redelegations, pageResponse] = await staking.redelegations(emptyDelegatorAddr, srcValidatorAddr, emptyDstValidatorAddr, pageRequest);
  for (let i = 0; i < redelegations.length; i++) {
    const redelegation = redelegations[i];
    console.log(`redelegation ${i + 1}:`, JSON.stringify(redelegation.toObject(true), undefined, 2));
  }

  console.log('pageResponse:', pageResponse.toObject(true));
};

// case3
export const main3 = async () => {
  const { rpc, contracts, stakingAddress } = await fs.readJSON('../cfg.json');
  const { abi } = await fs.readJSON(path.join(contracts, 'staking/IStaking.sol/IStaking.json'));
  const provider = new ethers.JsonRpcProvider(rpc);

  // input params
  const delegatorAddr = '0x00000Be6819f41400225702D32d3dd23663Dd690';
  const emptySrcValidatorAddr = '0x0000000000000000000000000000000000000000';
  const emptyDstValidatorAddr = '0x0000000000000000000000000000000000000000';
  const pageRequest = {
    key: '0x00',
    offset: 0,
    limit: 100,
    countTotal: true,
    reverse: false,
  };

  const staking = new ethers.Contract(stakingAddress, abi, provider);
  const [redelegations, pageResponse] = await staking.redelegations(delegatorAddr, emptySrcValidatorAddr, emptyDstValidatorAddr, pageRequest);
  for (let i = 0; i < redelegations.length; i++) {
    const redelegation = redelegations[i];
    console.log(`redelegation ${i + 1}:`, JSON.stringify(redelegation.toObject(true), undefined, 2));
  }

  console.log('pageResponse:', pageResponse.toObject(true));
};

main1();
main2();
main3();
