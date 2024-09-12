#!/bin/bash
script_path=$(dirname "$(realpath "$0")")

function generate() {
   default_cfg=$(realpath "$script_path/../cfg.default.json")
   sp_cfg=$(realpath "$script_path/../deployment/dockerup/sp.json")
   output_cfg="$script_path/../cfg.json"

   contract_path=$(realpath "$script_path/../../mechain/solidity/artifacts/contracts")

   seal_address=$(jq -r '.sp0.SealAddress' "$sp_cfg")
   primary_sp_address=$(jq -r '.sp0.OperatorAddress' "$sp_cfg")

   jq --arg contract_path "$contract_path" \
      --arg private_key "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" \
      --arg seal_address "$seal_address" \
      --arg primary_sp_address "$primary_sp_address" \
      '.contracts = $contract_path | 
    .privateKey = $private_key | 
    .sealAddress = $seal_address |
    .primarySpAddress = $primary_sp_address' \
      "$default_cfg" >"$output_cfg"

   echo "Generated $output_cfg"
}

CMD=$1
case ${CMD} in
generate)
   echo "===== generate config ===="
   generate
   echo "===== end ===="
   ;;

*)
   echo "Usage: localup.sh  generate "
   ;;
esac
