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

  const messages = [
    // consensus params
    {
      '@type': '/cosmos.gov.v1.MsgExecLegacyContent',
      authority: '0x7b5Fe22B5446f7C62Ea27B8BD71CeF94e03f3dF2',
      content: {
        '@type': '/cosmos.params.v1beta1.ParameterChangeProposal',
        title: 'Consensus Module Parameter Change: BlockParams.',
        description: 'change block max_bytes from 22020096 to 30000000',
        changes: [
          {
            subspace: 'baseapp',
            key: 'BlockParams',
            value: '{"max_bytes":"30000000","max_gas":"60000000"}',
          },
        ],
      },
    },
    // auth
    {
      '@type': '/cosmos.gov.v1.MsgExecLegacyContent',
      authority: '0x7b5Fe22B5446f7C62Ea27B8BD71CeF94e03f3dF2',
      content: {
        '@type': '/cosmos.params.v1beta1.ParameterChangeProposal',
        title: 'Auth Module Parameter Change: MaxMemoCharacters.',
        description: 'change max_memo_characters from 256 to 512',
        changes: [
          {
            subspace: 'auth',
            key: 'MaxMemoCharacters',
            value: '"512"',
          },
        ],
      },
    },
    // bank
    {
      '@type': '/cosmos.gov.v1.MsgExecLegacyContent',
      authority: '0x7b5Fe22B5446f7C62Ea27B8BD71CeF94e03f3dF2',
      content: {
        '@type': '/cosmos.params.v1beta1.ParameterChangeProposal',
        title: 'Bank Module Parameter Change: DefaultSendEnabled.',
        description: 'change default_send_enabled from true to false',
        changes: [
          {
            subspace: 'bank',
            key: 'DefaultSendEnabled',
            value: 'false',
          },
        ],
      },
    },
    // staking
    {
      '@type': '/cosmos.gov.v1.MsgExecLegacyContent',
      authority: '0x7b5Fe22B5446f7C62Ea27B8BD71CeF94e03f3dF2',
      content: {
        '@type': '/cosmos.params.v1beta1.ParameterChangeProposal',
        title: 'Staking Module Parameter Change: UnbondingTime.',
        description: 'change unbonding_time to 30min',
        changes: [
          {
            subspace: 'staking',
            key: 'UnbondingTime',
            value: '"1800000000000"',
          },
        ],
      },
    },
    // distribution
    {
      '@type': '/cosmos.gov.v1.MsgExecLegacyContent',
      authority: '0x7b5Fe22B5446f7C62Ea27B8BD71CeF94e03f3dF2',
      content: {
        '@type': '/cosmos.params.v1beta1.ParameterChangeProposal',
        title: 'Distribution Module Parameter Change: WithdrawAddrEnabled.',
        description: 'change withdraw_addr_enabled to false',
        changes: [
          {
            subspace: 'distribution',
            key: 'withdrawaddrenabled',
            value: 'false',
          },
        ],
      },
    },
    // slashing
    {
      '@type': '/cosmos.gov.v1.MsgExecLegacyContent',
      authority: '0x7b5Fe22B5446f7C62Ea27B8BD71CeF94e03f3dF2',
      content: {
        '@type': '/cosmos.params.v1beta1.ParameterChangeProposal',
        title: 'Slashing Module Parameter Change: SignedBlocksWindow.',
        description: 'change signed_blocks_window to 100',
        changes: [
          {
            subspace: 'slashing',
            key: 'SignedBlocksWindow',
            value: '"100"',
          },
        ],
      },
    },
    // gov
    {
      '@type': '/cosmos.gov.v1.MsgExecLegacyContent',
      authority: '0x7b5Fe22B5446f7C62Ea27B8BD71CeF94e03f3dF2',
      content: {
        '@type': '/cosmos.params.v1beta1.ParameterChangeProposal',
        title: 'Parameter change: voting period.',
        description: 'decrease voting period time to 18s',
        changes: [
          {
            subspace: 'gov',
            key: 'votingparams',
            value: '{"voting_period":"18000000000"}',
          },
        ],
      },
    },
    // evm
    {
      '@type': '/ethermint.evm.v1.MsgUpdateParams',
      authority: '0x7b5Fe22B5446f7C62Ea27B8BD71CeF94e03f3dF2',
      params: {
        evm_denom: 'azkme',
        enable_create: true,
        enable_call: true,
        extra_eips: ['3855'],
        chain_config: {
          homestead_block: '0',
          dao_fork_block: '0',
          dao_fork_support: true,
          eip150_block: '0',
          eip150_hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
          eip155_block: '0',
          eip158_block: '0',
          byzantium_block: '0',
          constantinople_block: '0',
          petersburg_block: '0',
          istanbul_block: '0',
          muir_glacier_block: '0',
          berlin_block: '0',
          london_block: '0',
          arrow_glacier_block: '0',
          gray_glacier_block: '0',
          merge_netsplit_block: '0',
          shanghai_block: '0',
          cancun_block: '0',
        },
        allow_unprotected_txs: false,
        evm_channels: [],
      },
    },
    // feemarket
    {
      '@type': '/ethermint.feemarket.v1.MsgUpdateParams',
      authority: '0x7b5Fe22B5446f7C62Ea27B8BD71CeF94e03f3dF2',
      params: {
        no_base_fee: false,
        base_fee_change_denominator: 8,
        elasticity_multiplier: 2,
        enable_height: '0',
        base_fee: '10000000000',
        min_gas_price: '20000000000.000000000000000000',
        min_gas_multiplier: '0.000100000000000000',
      },
    },
  ];

  const initialDeposit = [
    {
      denom,
      amount: '10000000',
    },
  ];

  let proposalId = 2;
  for (const message of messages) {
    let tx, receipt;
    const title = 'update params';
    const summary = 'use proposal test update params';
    let metadata = 'Just Test Update Params';
    tx = await gov.submitProposal(JSON.stringify([message]), initialDeposit, metadata, title, summary);
    receipt = await tx.wait();
    console.log(`legacy submit proposal success, blockNumber: ${receipt.blockNumber}, blockHash: ${receipt.blockHash}`);

    const option = ethers.Typed.uint8(1); // 0:Unspecified, 1:Yes, 2: Abstain, 3: No, 4:NoWithWeto
    metadata = 'hello, let vote yes';
    tx = await gov.vote(proposalId, option, metadata);
    receipt = await tx.wait();
    console.log(`vote proposal success, blockNumber: ${receipt.blockNumber}, blockHash: ${receipt.blockHash}`);

    proposalId++;
    break;
  }
};

main();
