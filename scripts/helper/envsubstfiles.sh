#!/bin/bash

# This script expands environment variables in all files of a directory
# ./envsubst.sh path/to/config/files/*

set -euo pipefail

function envsubstfiles {
    usepath=$1
    echo "Running envsubst in path $usepath"
    for filename in $usepath; do
        echo "Substituting environment variables in file $filename"
        (set -x; envsubst < ${filename} > ${filename}.env)
        (set -x; rm ${filename})
        (set -x; mv ${filename}.env ${filename})
    done
}
