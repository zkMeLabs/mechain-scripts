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

  const MsgCreateValidator = {
    '@type': '/cosmos.staking.v1beta1.MsgCreateValidator',
    description: {
      moniker: 'validator1',
      identity: '',
      website: 'http://website',
      security_contact: '',
      details: 'validator1',
    },
    commission: {
      rate: '0.070000000000000000',
      max_rate: '1.000000000000000000',
      max_change_rate: '0.010000000000000000',
    },
    min_self_delegation: '1',
    delegator_address: '0x9923C9ce3c605e9B8CE14B64CE4cfb39f5bd7DC9',
    validator_address: '0xA6CEd47a79832412a633003D92D203485964936F',
    pubkey: {
      '@type': '/cosmos.crypto.ed25519.PubKey',
      key: 'Kh9oDVjXzp+FIz9p2cQ42ECE9rwPPqHH3TmUEOXPBj0=',
    },
    value: {
      denom: 'azkme',
      amount: '10000000000000000000000000',
    },
    from: '0x7b5Fe22B5446f7C62Ea27B8BD71CeF94e03f3dF2',
    relayer_address: '0x11FF7D9D45911C08Ff764034Ab606a3901161835',
    challenger_address: '0xAfA6e1198C9ece53383c06cBF23e4F6cDdADB0ED',
    bls_key:
      '20b3527213b5ee86696f16e62c0d6ac72bd338c642b979bfba21c541503065dd08f4ac071e7931ef6fdec118d02224494979bb9891e4bd48a654e116f56b60c316577ef746b1cd4efb7baa15e5b103033c7649f822d046d45d42e460686391630f1d0d762a8ef21951109a2d1acc3086683c5be3c49f060f0f419b6233c744a8',
    bls_proof: '0c3bfe012a8b4feaacdc2d0bc202fdf4ec6320c726c7cd911ca7cf053267d02421ca42471f4e23f03f0011c5f29b6246fc3d220c4895c0c13c3584621e765f3c',
  };

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

  const messages = JSON.stringify([MsgCreateValidator]); // update you msg here
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
