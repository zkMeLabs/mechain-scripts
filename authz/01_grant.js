import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export const main = async () => {
  const { rpc, contracts, authzAddress, denom } = await fs.readJSON('../cfg.json');
  const { abi } = await fs.readJSON(path.join(contracts, 'authz/IAuthz.sol/IAuthz.json'));
  const provider = new ethers.JsonRpcProvider(rpc);

  {
    // for create a new validator
    const privateKey = 'f78a036930ce63791ea6ea20072986d8c3f16a6811f6a2583b0787c45086f769';
    const wallet = new ethers.Wallet(privateKey, provider);
    const authz = new ethers.Contract(authzAddress, abi, wallet);

    // input params
    const grantee = '0x7b5Fe22B5446f7C62Ea27B8BD71CeF94e03f3dF2';
    const authzType = 'generic';
    const authorization = '/cosmos.staking.v1beta1.MsgDelegate';
    const limit = [];
    const expiration = 0;
    const tx = await authz.grant(grantee, authzType, authorization, limit, expiration);
    const receipt = await tx.wait();
    console.log(`grant success, blockNumber: ${receipt.blockNumber}, blockHash: ${receipt.blockHash}`);
  }

  {
    // for create a new sp
    const privateKey = 'f78a036930ce63791ea6ea20072986d8c3f16a6811f6a2583b0787c45086f769';
    const wallet = new ethers.Wallet(privateKey, provider);
    const authz = new ethers.Contract(authzAddress, abi, wallet);

    // input params
    const grantee = '0x7b5Fe22B5446f7C62Ea27B8BD71CeF94e03f3dF2';
    const authzType = 'spDeposit';
    const authorization = '0x00000be6819f41400225702d32d3dd23663dd690';
    const limit = [
      {
        denom: 'azkme',
        amount: '10000000000000000000000000',
      },
    ];
    const expiration = 0;
    const tx = await authz.grant(grantee, authzType, authorization, limit, expiration);
    const receipt = await tx.wait();
    console.log(`grant success, blockNumber: ${receipt.blockNumber}, blockHash: ${receipt.blockHash}`);
  }
};

main();
