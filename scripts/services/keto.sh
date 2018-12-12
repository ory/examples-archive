#!/bin/bash

set -euo pipefail

source "$( dirname "${BASH_SOURCE[0]}" )/../helper/getid.sh"

url=$1
path=$2
policy_path="$path/policies/*.json"

echo "Deleting policies in $policy_path..."
for filename in $policy_path; do
    id=$(getid $filename)
    (set -x; keto engines acp ory policies delete --endpoint $url exact $id || true)
done
echo "Deleted all policies in $policy_path!"

echo "Importing policies in $policy_path..."
for filename in $policy_path; do
    (set -x; keto engines acp ory policies import --endpoint $url exact $filename)
done
echo "Imported all policies in $policy_path!"
