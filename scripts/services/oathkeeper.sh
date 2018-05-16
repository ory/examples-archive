#!/bin/bash

set -euo pipefail

url=$1
path=$2
rule_path="$path/rules/*.json"

echo "Importing oathkeeper rules from $rule_path..."
for filename in $rule_path; do
    (set -x; oathkeeper rules import --endpoint "${url}" ${filename})
done
echo "Imported oathkeeper rules from $rule_path!"
