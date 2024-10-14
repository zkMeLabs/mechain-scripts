import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

export const main = async () => {
  const { rpc, contracts, authzAddress } = await fs.readJSON('../cfg.json');
  const { abi } = await fs.readJSON(path.join(contracts, 'authz/IAuthz.sol/IAuthz.json'));
  const provider = new ethers.JsonRpcProvider(rpc);

  // input params
  const grantee = '0x7b5Fe22B5446f7C62Ea27B8BD71CeF94e03f3dF2';
  const pageRequest = {
    key: '0x00',
    offset: 0,
    limit: 100,
    countTotal: false,
    reverse: false,
  };

  const authz = new ethers.Contract(authzAddress, abi, provider);
  const [grants, pageResponse] = await authz.granteeGrants(grantee, pageRequest);
  // console.log('grants', grants.toObject(true));
  for (const grant of grants) {
    console.log('grant', grant.toObject(true));
  }
  console.log('pageResponse:', pageResponse.toObject(true));
};

main();
