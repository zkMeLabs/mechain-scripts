import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export const main = async () => {
  const { rpc, contracts, govAddress, denom } = await fs.readJSON('../cfg.json');
  const { abi } = await fs.readJSON(path.join(contracts, 'gov/IGov.sol/IGov.json'));
  const provider = new ethers.JsonRpcProvider(rpc);

  // input params
  const privateKey = 'e54bff83fc945cba77ca3e45d69adc5b57ad8db6073736c8422692abecfb5fe2';
  const wallet = new ethers.Wallet(privateKey, provider);
  const gov = new ethers.Contract(govAddress, abi, wallet);

  const MsgCreateStorageProvider = {
    '@type': '/greenfield.sp.MsgCreateStorageProvider',
    creator: '0x7b5Fe22B5446f7C62Ea27B8BD71CeF94e03f3dF2',
    description: {
      moniker: 'new sp',
      identity: '',
      website: 'http://website',
      security_contact: '',
      details: 'new sp detail',
    },
    sp_address: '0x00000be6819f41400225702d32d3dd23663dd690',
    funding_address: '0x00000be6819f41400225702d32d3dd23663dd690',
    seal_address: '0x00000be6819f41400225702d32d3dd23663dd690',
    approval_address: '0x00000be6819f41400225702d32d3dd23663dd690',
    gc_address: '0x00000be6819f41400225702d32d3dd23663dd690',
    maintenance_address: '0x00000be6819f41400225702d32d3dd23663dd690',
    endpoint: 'http://127.0.0.1:9040',
    deposit: {
      denom: 'azkme',
      amount: '10000000000000000000000',
    },
    read_price: '100.000000000000000000',
    free_read_quota: '100000000',
    store_price: '10000.000000000000000000',
    bls_key:
      '18ff4f6e749aa941abb357b8f79d5cd7010d8be0f859f3e81ebdbbde0f0184fe0aa5d09f1940efc3949287ca3bcbf39caf1f5d5d8aa2380a424ba935d4e21f300bb32f8fc780e2c189cb1a4e2daa147955de717740252f3620e95640af51822b169d33f439146fdb898c23341cd646dadb205f9ae460a25dd5a53b2c94e88eb9',
    bls_proof: '193b332b229dc8c7799184e10c74ee29483bda1446f7096c40455206b546c4b31f6647e94634a4821ea54e65cae570127b07d70c9307b0951ffad5f2bfe5fd03',
  };

  const messages = JSON.stringify([MsgCreateStorageProvider]); // update you msg here
  const metadata = 'Just Test Proposal';
  const title = 'create validator1';
  const summary = 'use proposal create validator1';
  const initialDeposit = [
    {
      denom,
      amount: '1000000000000000000',
    },
  ];

  const tx = await gov.submitProposal(messages, initialDeposit, metadata, title, summary);
  const receipt = await tx.wait();
  console.log('legacy submit proposal success, receipt: ', receipt);
};

main();
