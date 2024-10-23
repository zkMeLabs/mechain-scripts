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

  // passed
  const consunsus = {
    '@type': '/cosmos.consensus.v1.MsgUpdateParams',
    authority: '0x7b5Fe22B5446f7C62Ea27B8BD71CeF94e03f3dF2',
    block: {
      max_txs: '24000',
      max_bytes: '3145728',
      max_gas: '800000000',
    },
    evidence: {
      max_age_num_blocks: '100000',
      max_age_duration: '10s',
      max_bytes: '1048576',
    },
    validator: {
      pub_key_types: ['ed25519'],
    },
  };

  // passed
  const feemarket = {
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
  };
  // passed
  const evm = {
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
      allow_unprotected_txs: true,
      evm_channels: [],
    },
  };

  // passed
  const auth = {
    '@type': '/cosmos.auth.v1beta1.MsgUpdateParams',
    authority: '0x7b5Fe22B5446f7C62Ea27B8BD71CeF94e03f3dF2',
    params: {
      max_memo_characters: '512',
      tx_sig_limit: '7',
      tx_size_cost_per_byte: '10',
      sig_verify_cost_ed25519: '590',
      sig_verify_cost_secp256k1: '1000',
    },
  };

  // passed
  const bank = {
    '@type': '/cosmos.bank.v1beta1.MsgUpdateParams',
    authority: '0x7b5Fe22B5446f7C62Ea27B8BD71CeF94e03f3dF2',
    params: {
      send_enabled: [],
      default_send_enabled: false,
    },
  };

  // passed
  const staking = {
    '@type': '/cosmos.staking.v1beta1.MsgUpdateParams',
    authority: '0x7b5Fe22B5446f7C62Ea27B8BD71CeF94e03f3dF2',
    params: {
      community_tax: '0.020000000000000000',
      base_proposer_reward: '0.000000000000000000',
      bonus_proposer_reward: '0.000000000000000000',
      withdraw_addr_enabled: false,
    },
  };

  // passed
  const distribution = {
    '@type': '/cosmos.distribution.v1beta1.MsgUpdateParams',
    authority: '0x7b5Fe22B5446f7C62Ea27B8BD71CeF94e03f3dF2',
    params: {
      community_tax: '0.020000000000000000',
      base_proposer_reward: '0.000000000000000000',
      bonus_proposer_reward: '0.000000000000000000',
      withdraw_addr_enabled: false,
    },
  };

  // passed
  const slashing = {
    '@type': '/cosmos.slashing.v1beta1.MsgUpdateParams',
    authority: '0x7b5Fe22B5446f7C62Ea27B8BD71CeF94e03f3dF2',
    params: {
      signed_blocks_window: '100000',
      min_signed_per_window: '0.500000000000000000',
      downtime_jail_duration: '600s',
      slash_fraction_double_sign: '0.050000000000000000',
      slash_fraction_downtime: '0.010000000000000000',
    },
  };

  // passed
  const govParams = {
    '@type': '/cosmos.gov.v1.MsgUpdateParams',
    authority: '0x7b5Fe22B5446f7C62Ea27B8BD71CeF94e03f3dF2',
    params: {
      min_deposit: [
        {
          denom: 'azkme',
          amount: '1',
        },
      ],
      max_deposit_period: '60s',
      voting_period: '10s',
      quorum: '0.334000000000000000',
      threshold: '0.500000000000000000',
      veto_threshold: '0.334000000000000000',
      min_initial_deposit_ratio: '0.000000000000000000',
      burn_vote_quorum: false,
      burn_proposal_deposit_prevote: false,
      burn_vote_veto: true,
    },
  };

  const messages = [consunsus];

  const initialDeposit = [
    {
      denom,
      amount: '1000000000000000000',
    },
  ];

  const status = 0;
  const voter = '0x0000000000000000000000000000000000000000';
  const depositor = '0x0000000000000000000000000000000000000000';
  const pageRequest = {
    key: '0x00',
    offset: 0,
    limit: 100,
    countTotal: true,
    reverse: false,
  };

  for (const message of messages) {
    let tx, receipt;
    const title = 'update params';
    const summary = 'use proposal test update params';
    let metadata = 'Just Test Update Params';
    tx = await gov.submitProposal(JSON.stringify([message]), initialDeposit, metadata, title, summary);
    receipt = await tx.wait();
    console.log(`legacy submit proposal success, blockNumber: ${receipt.blockNumber}, blockHash: ${receipt.blockHash}`);

    const [_, pageResponse] = await gov.proposals(status, voter, depositor, pageRequest);

    let proposalId = pageResponse.total;
    console.log('current proposal id', proposalId);

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
