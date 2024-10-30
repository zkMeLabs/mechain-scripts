import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

export const main = async () => {
  try {
    const { rpc, contracts, stakingAddress } = await fs.readJSON('../cfg.json');
    const { abi } = await fs.readJSON(path.join(contracts, 'staking/IStaking.sol/IStaking.json'));
    const provider = new ethers.JsonRpcProvider(rpc);

    // input params
    const privateKey = 'e54bff83fc945cba77ca3e45d69adc5b57ad8db6073736c8422692abecfb5fe2';
    const wallet = new ethers.Wallet(privateKey, provider);
    const validatorAddress = wallet.address;
    const description = ['[do-not-modify]', '[do-not-modify]', '[do-not-modify]', '[do-not-modify]', 'i want update my details'];
    const commissionRate = '-1';
    const minSelfDelegation = 8000000;
    const relayerAddress = '0x0000000000000000000000000000000000000000';
    const challengerAddress = '0x0000000000000000000000000000000000000000';
    const blsKey = '';
    const blsProof = '';

    let validator;

    const staking = new ethers.Contract(stakingAddress, abi, wallet);
    validator = await staking.validator(validatorAddress);
    console.log('validator before modify', validator.toObject(true));

    const tx = await staking.editValidator(description, commissionRate, minSelfDelegation, relayerAddress, challengerAddress, blsKey, blsProof);
    await tx.wait();

    validator = await staking.validator(validatorAddress);
    console.log('validator after modify', validator.toObject(true));
  } catch (error) {
    console.log('error', error);
  }
};

main();
