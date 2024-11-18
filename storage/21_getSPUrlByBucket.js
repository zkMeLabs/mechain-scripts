import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

export const main = async () => {
  const { rpc, contracts, storageAddress, virtualGroupAddress, spAddress, bucketName } = await fs.readJSON('../cfg.json');
  const { abi: abiStorage } = await fs.readJSON(path.join(contracts, 'storage/IStorage.sol/IStorage.json'));
  const { abi: abiVirtualGroup } = await fs.readJSON(path.join(contracts, 'virtualgroup/IVirtualGroup.sol/IVirtualGroup.json'));
  const { abi: abiSp } = await fs.readJSON(path.join(contracts, 'storageprovider/IStorageProvider.sol/IStorageProvider.json'));

  const provider = new ethers.JsonRpcProvider(rpc);
  const storage = new ethers.Contract(storageAddress, abiStorage, provider);
  const virtualGroup = new ethers.Contract(virtualGroupAddress, abiVirtualGroup, provider);
  const sp = new ethers.Contract(spAddress, abiSp, provider);

  const params = await storage.params();
  console.log('params:', params.toObject(true));

  const getSPUrlByBucket = async (bucketName) => {
    const [bucketInfo, _] = await storage.headBucket(bucketName);
    console.log('bucket:', bucketInfo.toObject(true));

    const gvgfamily = await virtualGroup.globalVirtualGroupFamily(bucketInfo.globalVirtualGroupFamilyId);
    console.log('gvgfamily:', gvgfamily.toObject(true));

    // input params
    const pageRequest = {
      key: '0x00',
      offset: 0,
      limit: 100,
      countTotal: true,
      reverse: false,
    };
    const [sps, __] = await sp.storageProviders(pageRequest);
    for (const item of sps) {
      if (item.id == gvgfamily.primarySpId) {
        console.log('storage provider', item.toObject(true));
        return item.endpoint;
      }
    }
  };

  const spUrl = await getSPUrlByBucket(bucketName);
  console.log({ spUrl });
};

main();
