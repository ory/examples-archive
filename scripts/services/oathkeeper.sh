#!/bin/bash

set -euo pipefail

cd "$( dirname "${BASH_SOURCE[0]}" )/../.."

url=$1
path=$2
rule_path="$path/rules/*.json"

echo "Deleting oathkeeper rules from $rule_path..."
for filename in $rule_path; do
    id=$(cat $filename | grep '"id":' | sed 's/^\s+"id": "\([^"]*\)",$/\1/g')
    (set -x; curl -s -f \
        -X DELETE \
        --url "${url}rules/${id}" \
        || true)
done
echo "Deleted all oathkeeper rules from $rule_path!"

echo "Importing oathkeeper rules from $rule_path..."
for filename in $rule_path; do
    (set -x; curl -f -s -X POST \
        --url "${url}rules" \
        -H "Content-Type: application/json" \
        --data "@"${filename})
done
echo "Imported oathkeeper rules from $rule_path!"
