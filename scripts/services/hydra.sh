#!/bin/bash

set -euo pipefail

path=$1
client_path="$path/clients/*.json"

echo "Deleting clients in $client_path..."
for filename in $client_path; do
    id=$(cat $filename | grep '"id":' | sed 's/^\s+"id": "\([^"]*\)",/\1/g')
    (set -x; hydra clients delete $id || true)
done
echo "Deleted all clients in $client_path!"

echo "Importing clients in $client_path..."
for filename in $client_path; do
    (set -x; hydra clients import $filename)
done
echo "Imported all clients in $client_path!"
