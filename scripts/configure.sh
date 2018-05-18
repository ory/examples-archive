#!/bin/bash

set -euo pipefail

cd "$( dirname "${BASH_SOURCE[0]}" )/.."

echo "Sourcing helpers..."
source /scripts/helper/retry.sh
source /scripts/helper/envsubstfiles.sh
source /scripts/helper/getid.sh

echo "Substituting environment variables"
if [ -d "/config/hydra/clients/" ]; then
    envsubstfiles "/config/hydra/clients/*.json"
fi
if [ -d "/config/keto/policies/" ]; then
    envsubstfiles "/config/keto/policies/*.json"
fi
if [ -d "/config/oathkeeper/rules/" ]; then
    envsubstfiles "/config/oathkeeper/rules/*.json"
fi

echo "Executing bootstrap scripts..."

hydra_url=${HYDRA_URL:=undefined}
oathkeeper_url=${OATHKEEPER_API_URL:=undefined}
keto_url=${KETO_URL:=undefined}

export HYDRA_URL=${hydra_url%/}/

if [ -d "/config/hydra" ]; then
    backoff /scripts/services/hydra.sh "/config/hydra"
fi

if [ -d "/config/oathkeeper" ]; then
    backoff /scripts/services/oathkeeper.sh ${oathkeeper_url%/}/ "/config/oathkeeper"
fi

if [ -d "/config/keto" ]; then
    backoff /scripts/services/keto.sh ${keto_url%/}/ "/config/keto"
fi
