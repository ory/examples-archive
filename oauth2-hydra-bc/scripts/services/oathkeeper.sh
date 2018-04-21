#!/bin/bash

set -euo pipefail

source "$( dirname "${BASH_SOURCE[0]}" )/../helper/getid.sh"

url=$1
path=$2
rule_path="$path/rules/*.json"

echo "Deleting oathkeeper rules from $rule_path..."
for filename in $rule_path; do
    id=$(getid $filename)
    (set -x; oathkeeper rules delete --endpoint "${url}" ${id} || true)
done
echo "Deleted all oathkeeper rules from $rule_path!"

echo "Importing oathkeeper rules from $rule_path..."
for filename in $rule_path; do
    (set -x; oathkeeper rules import --endpoint "${url}" ${filename})
done
echo "Imported oathkeeper rules from $rule_path!"
