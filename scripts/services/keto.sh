#!/bin/bash

set -euo pipefail

cd "$( dirname "${BASH_SOURCE[0]}" )/../.."

url=$1
path=$2
policy_path="$path/policies/*.json"

echo "Deleting policies in $policy_path..."
for filename in $policy_path; do
    id=$(cat $filename | grep '"id":' | sed 's/^\s+"id": "\([^"]*\)",/\1/g')
    (set -x; keto policies --url $url delete $id || true)
done
echo "Deleted all clients in $client_path!"

echo "Importing policies in $policy_path..."
for filename in $policy_path; do
    (set -x; keto policies --url $url create -f $filename)
done
echo "Imported all policies in $policy_path!"
