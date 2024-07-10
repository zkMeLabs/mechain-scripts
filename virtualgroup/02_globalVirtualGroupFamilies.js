import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

export const main = async () => {
  const { rpc, contracts, virtualGroupAddress } =
    await fs.readJSON('../cfg.json');
  const { abi } = await fs.readJSON(
    path.join(contracts, 'virtualgroup/IVirtualGroup.sol/IVirtualGroup.json'),
  );
  const provider = new ethers.JsonRpcProvider(rpc);

  // input params
  const pageRequest = {
    key: '0x00',
    offset: 0,
    limit: 100,
    countTotal: false,
    reverse: false,
  };

  const virtualGroup = new ethers.Contract(virtualGroupAddress, abi, provider);
  const [gvgFamilies, pageResponse] =
    await virtualGroup.globalVirtualGroupFamilies(pageRequest);
  for (const gvgFamily of gvgFamilies) {
    console.log('gvgFamily', gvgFamily.toObject(true));
  }
  console.log('pageResponse:', pageResponse.toObject(true));
};

main();
