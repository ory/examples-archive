#!/bin/bash

set -euo pipefail

source "$( dirname "${BASH_SOURCE[0]}" )/../helper/getid.sh"

url=$1
path=$2
role_path="$path/roles/*.json"

echo "Deleting roles in $role_path..."
for filename in $role_path; do
    id=$(getid $filename)
    (set -x; keto engines acp ory roles delete --endpoint $url exact $id || true)
done
echo "Deleted all roles in $role_path!"

echo "Importing roles in $role_path..."
for filename in $role_path; do
    (set -x; keto engines acp ory roles import --endpoint $url exact $filename)
done
echo "Imported all roles in $role_path!"

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
