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

  const bank = {
    '@type': '/cosmos.bank.v1beta1.MsgUpdateParams',
    authority: '0x7b5Fe22B5446f7C62Ea27B8BD71CeF94e03f3dF2',
    params: {
      send_enabled: [],
      default_send_enabled: false,
    },
  };

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

  const crisis = {
    '@type': '/cosmos.crisis.v1beta1.MsgUpdateParams',
    authority: '0x7b5Fe22B5446f7C62Ea27B8BD71CeF94e03f3dF2',
    constant_fee: {
      denom: 'azkme',
      amount: '8000000000',
    },
  };

  const crosschain = {
    '@type': '/cosmos.crosschain.v1.MsgUpdateParams',
    authority: '0x7b5Fe22B5446f7C62Ea27B8BD71CeF94e03f3dF2',
    params: {
      init_module_balance: '8000000000000000000000000',
    },
  };

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

  const gashub = {
    '@type': '/cosmos.gashub.v1beta1.MsgUpdateParams',
    authority: '0x7b5Fe22B5446f7C62Ea27B8BD71CeF94e03f3dF2',
    params: {
      max_tx_size: '65536',
      min_gas_per_byte: '8',
    },
  };

  const oracle = {
    '@type': '/cosmos.oracle.v1.MsgUpdateParams',
    authority: '0x7b5Fe22B5446f7C62Ea27B8BD71CeF94e03f3dF2',
    params: {
      relayer_timeout: '400',
      relayer_interval: '6000',
      relayer_reward_share: 80,
    },
  };

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

  const bridge = {
    '@type': '/mechain.bridge.MsgUpdateParams',
    authority: '0x7b5Fe22B5446f7C62Ea27B8BD71CeF94e03f3dF2',
    params: {
      bsc_transfer_out_relayer_fee: '60000000000000',
      bsc_transfer_out_ack_relayer_fee: '1',
    },
  };

  const challenge = {
    '@type': '/mechain.challenge.MsgUpdateParams',
    authority: '0x7b5Fe22B5446f7C62Ea27B8BD71CeF94e03f3dF2',
    params: {
      challenge_count_per_block: '6',
      challenge_keep_alive_period: '10',
      slash_cooling_off_period: '300',
      slash_amount_size_rate: '0.008500000000000000',
      slash_amount_min: '10000000000000000',
      slash_amount_max: '1000000000000000000',
      reward_validator_ratio: '0.900000000000000000',
      reward_submitter_ratio: '0.001000000000000000',
      reward_submitter_threshold: '1000000000000000',
      heartbeat_interval: '100',
      attestation_inturn_interval: '10',
      attestation_kept_count: '300',
      sp_slash_max_amount: '5000000000000000000',
      sp_slash_counting_window: '43200',
    },
  };

  const erc20 = {
    '@type': '/evmos.erc20.v1.MsgUpdateParams',
    authority: '0x7b5Fe22B5446f7C62Ea27B8BD71CeF94e03f3dF2',
    params: {
      enable_erc20: false,
      enable_evm_hook: false,
    },
  };

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

  const payment = {
    '@type': '/mechain.payment.MsgUpdateParams',
    authority: '0x7b5Fe22B5446f7C62Ea27B8BD71CeF94e03f3dF2',
    params: {
      versioned_params: {
        reserve_time: '60',
        validator_tax_rate: '0.010000000000000000',
      },
      payment_account_count_limit: '300',
      forced_settle_time: '30',
      max_auto_settle_flow_count: '100',
      max_auto_resume_flow_count: '100',
      fee_denom: 'azkme',
      withdraw_time_lock_threshold: '100000000000000000000',
      withdraw_time_lock_duration: '86400',
    },
  };

  const permission = {
    '@type': '/mechain.permission.MsgUpdateParams',
    authority: '0x7b5Fe22B5446f7C62Ea27B8BD71CeF94e03f3dF2',
    params: {
      maximum_statements_num: '100',
      maximum_group_num: '100',
      maximum_remove_expired_policies_iteration: '1000',
    },
  };

  const sp = {
    '@type': '/mechain.sp.MsgUpdateParams',
    authority: '0x7b5Fe22B5446f7C62Ea27B8BD71CeF94e03f3dF2',
    params: {
      deposit_denom: 'azkme',
      min_deposit: '80000000000000000000000',
      secondary_sp_store_price_ratio: '0.120000000000000000',
      num_of_historical_blocks_for_maintenance_records: '864000',
      maintenance_duration_quota: '216000',
      num_of_lockup_blocks_for_maintenance: '216000',
      update_global_price_interval: '8',
      update_price_disallowed_days: 0,
    },
  };

  const storage = {
    '@type': '/mechain.storage.MsgUpdateParams',
    authority: '0x7b5Fe22B5446f7C62Ea27B8BD71CeF94e03f3dF2',
    params: {
      versioned_params: {
        max_segment_size: '16777216',
        redundant_data_chunk_num: 2,
        redundant_parity_chunk_num: 2,
        min_charge_size: '1048576',
      },
      max_payload_size: '168719476736',
      bsc_mirror_bucket_relayer_fee: '1300000000000000',
      bsc_mirror_bucket_ack_relayer_fee: '250000000000000',
      bsc_mirror_object_relayer_fee: '1300000000000000',
      bsc_mirror_object_ack_relayer_fee: '250000000000000',
      bsc_mirror_group_relayer_fee: '1300000000000000',
      bsc_mirror_group_ack_relayer_fee: '250000000000000',
      max_buckets_per_account: 200,
      discontinue_counting_window: '10000',
      discontinue_object_max: '18446744073709551615',
      discontinue_bucket_max: '18446744073709551615',
      discontinue_confirm_period: '5',
      discontinue_deletion_max: '2',
      stale_policy_cleanup_max: '200',
      min_quota_update_interval: '2592000',
      max_local_virtual_group_num_per_bucket: 100,
      op_mirror_bucket_relayer_fee: '130000000000000',
      op_mirror_bucket_ack_relayer_fee: '25000000000000',
      op_mirror_object_relayer_fee: '130000000000000',
      op_mirror_object_ack_relayer_fee: '25000000000000',
      op_mirror_group_relayer_fee: '130000000000000',
      op_mirror_group_ack_relayer_fee: '25000000000000',
      polygon_mirror_bucket_relayer_fee: '130000000000000',
      polygon_mirror_bucket_ack_relayer_fee: '25000000000000',
      polygon_mirror_object_relayer_fee: '130000000000000',
      polygon_mirror_object_ack_relayer_fee: '25000000000000',
      polygon_mirror_group_relayer_fee: '130000000000000',
      polygon_mirror_group_ack_relayer_fee: '25000000000000',
      scroll_mirror_bucket_relayer_fee: '130000000000000',
      scroll_mirror_bucket_ack_relayer_fee: '25000000000000',
      scroll_mirror_object_relayer_fee: '130000000000000',
      scroll_mirror_object_ack_relayer_fee: '25000000000000',
      scroll_mirror_group_relayer_fee: '130000000000000',
      scroll_mirror_group_ack_relayer_fee: '25000000000000',
      linea_mirror_bucket_relayer_fee: '130000000000000',
      linea_mirror_bucket_ack_relayer_fee: '25000000000000',
      linea_mirror_object_relayer_fee: '130000000000000',
      linea_mirror_object_ack_relayer_fee: '25000000000000',
      linea_mirror_group_relayer_fee: '130000000000000',
      linea_mirror_group_ack_relayer_fee: '25000000000000',
      mantle_mirror_bucket_relayer_fee: '130000000000000',
      mantle_mirror_bucket_ack_relayer_fee: '25000000000000',
      mantle_mirror_object_relayer_fee: '130000000000000',
      mantle_mirror_object_ack_relayer_fee: '25000000000000',
      mantle_mirror_group_relayer_fee: '130000000000000',
      mantle_mirror_group_ack_relayer_fee: '25000000000000',
      arbitrum_mirror_bucket_relayer_fee: '130000000000000',
      arbitrum_mirror_bucket_ack_relayer_fee: '25000000000000',
      arbitrum_mirror_object_relayer_fee: '130000000000000',
      arbitrum_mirror_object_ack_relayer_fee: '25000000000000',
      arbitrum_mirror_group_relayer_fee: '130000000000000',
      arbitrum_mirror_group_ack_relayer_fee: '25000000000000',
      optimism_mirror_bucket_relayer_fee: '130000000000000',
      optimism_mirror_bucket_ack_relayer_fee: '25000000000000',
      optimism_mirror_object_relayer_fee: '130000000000000',
      optimism_mirror_object_ack_relayer_fee: '25000000000000',
      optimism_mirror_group_relayer_fee: '130000000000000',
      optimism_mirror_group_ack_relayer_fee: '25000000000000',
    },
  };

  const virtualgroup = {
    '@type': '/mechain.virtualgroup.MsgUpdateParams',
    authority: '0x7b5Fe22B5446f7C62Ea27B8BD71CeF94e03f3dF2',
    params: {
      deposit_denom: 'azkme',
      gvg_staking_per_bytes: '16000',
      max_local_virtual_group_num_per_bucket: 10,
      max_global_virtual_group_num_per_family: 100,
      max_store_size_per_family: '70368744177664',
      swap_in_validity_period: '604800',
      sp_concurrent_exit_num: '10',
    },
  };

  const messages = [virtualgroup];

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
