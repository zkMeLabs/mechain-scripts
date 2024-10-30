import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

BigInt.prototype.toJSON = function () {
  return this.toString();
};

/**
 * @description redelegate
 * defines a method for performing a redelegation of coins
 * from a delegator and source validator to a destination validator.
 */
export const main = async () => {
  try {
    const { rpc, contracts, stakingAddress } = await fs.readJSON('../cfg.json');
    const { abi } = await fs.readJSON(path.join(contracts, 'staking/IStaking.sol/IStaking.json'));
    const provider = new ethers.JsonRpcProvider(rpc);

    const privateKey = 'f78a036930ce63791ea6ea20072986d8c3f16a6811f6a2583b0787c45086f769';
    const wallet = new ethers.Wallet(privateKey, provider);

    // input params
    const staking = new ethers.Contract(stakingAddress, abi, wallet);
    const validatorSrcAddress = '0xbf657d0ef7b48167657a703ed8fd063f075246d7';
    const validatorDstAddress = '0xdeAFEfeAd45B801f7661020469190AA041b2d51F';
    const amount = '20000000000000000000';

    const tx = await staking.redelegate(validatorSrcAddress, validatorDstAddress, amount);
    const receipt = await tx.wait();
    console.log('redelegate receipt:', JSON.stringify(receipt, undefined, 2));

    const res = await staking.delegation(wallet.address, validatorDstAddress);
    console.log('delegation:', JSON.stringify(res.toObject(true), undefined, 2));
  } catch (error) {
    console.log('error', error);
  }
};

main();
