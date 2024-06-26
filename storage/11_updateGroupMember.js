import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

export const main = async () => {
  try {
    const { rpc, contracts, storageAddress } = await fs.readJSON('../cfg.json');
    const { abi } = await fs.readJSON(path.join(contracts, 'storage/IStorage.sol/IStorage.json'));
    const provider = new ethers.JsonRpcProvider(rpc);

    // input params
    const privateKey = 'f78a036930ce63791ea6ea20072986d8c3f16a6811f6a2583b0787c45086f769'; // YOU PRIVATE KEY
    const wallet = new ethers.Wallet(privateKey, provider);
    const groupName = 'mechain';
    const groupOwner = '0x62d574476d10f5745DC0c686c280762f97251c8a';

    const membersToAdd = [
      '0x757F0F85A5184c4E0183525EbD8fEdcD53b7eF80', '0xf0c2B9aaca1ce4e587e8f69D94F568BF051b2484'
    ];
    const expirationTime = [
      '1720000000', 0
    ]
    const membersToDelete = [
      '0x1A4eCc4333F72F910583610Ec835a26f2779109d', '0x3c6Ae7CC0F1E88675c1CD5587E216B03624E50cd'
    ];

    const storage = new ethers.Contract(storageAddress, abi, wallet);
    const tx = await storage.updateGroup(
      groupOwner,
      groupName,
      membersToAdd,
      expirationTime,
      membersToDelete
    );
    const receipt = await tx.wait();
    console.log('update group member success, receipt: ', receipt);
  } catch (error) {
    console.log('error', error);
  }
};

main();
