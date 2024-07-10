import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

export const main = async () => {
  try {
    const { rpc, contracts, storageAddress, privateKey } =
      await fs.readJSON('../cfg.json');
    const { abi } = await fs.readJSON(
      path.join(contracts, 'storage/IStorage.sol/IStorage.json'),
    );
    const provider = new ethers.JsonRpcProvider(rpc);

    // input params
    const wallet = new ethers.Wallet(privateKey, provider);
    const groupName = 'abcd';
    const groupOwner = '0xaA2FA1b6f9FCb3946c7Cd98Cc07118c67405e53a';

    const members = [
      '0xddbCd65E000a7B5b58e4be7a05b1626D95Bd3e27',
      '0x8524429Bab0E9c78eFAb54291EAc414c87fE2EBc',
    ];
    const expirationTime = ['1730000000', '1730000000'];

    const storage = new ethers.Contract(storageAddress, abi, wallet);
    const tx = await storage.renewGroupMember(
      groupOwner,
      groupName,
      members,
      expirationTime,
    );
    const receipt = await tx.wait();
    console.log('update group member success, receipt: ', receipt);
  } catch (error) {
    console.log('error', error);
  }
};

main();
