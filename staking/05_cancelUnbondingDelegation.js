import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export const main = async () => {
  try {
    const { rpc, contracts, stakingAddress } = await fs.readJSON('../cfg.json');
    const { abi } = await fs.readJSON(path.join(contracts, 'staking/IStaking.sol/IStaking.json'));
    const provider = new ethers.JsonRpcProvider(rpc);

    // input params
    const privateKey = 'f78a036930ce63791ea6ea20072986d8c3f16a6811f6a2583b0787c45086f769';
    const wallet = new ethers.Wallet(privateKey, provider);

    const staking = new ethers.Contract(stakingAddress, abi, wallet);
    const validatorAddress = '0xbf657d0ef7b48167657a703ed8fd063f075246d7';
    const amount = '30000000000000000000';
    const creationHeight = '2878'; // 需要根据实际情况更新
    const tx = await staking.cancelUnbondingDelegation(validatorAddress, amount, creationHeight);
    await tx.wait();

    const res = await staking.delegation(wallet.address, validatorAddress);
    console.log('delegation: ', JSON.stringify(res.toObject(true), undefined, 2));
  } catch (error) {
    console.log('error', error);
  }
};

main();
