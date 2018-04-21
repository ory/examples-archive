#!/bin/bash

set -euo pipefail

cd "$( dirname "${BASH_SOURCE[0]}" )/.."

echo "Sourcing helpers..."
source ./scripts/helper/retry.sh
source ./scripts/helper/envsubstfiles.sh

echo "Substituting environment variables"
envsubstfiles "./config/oathkeeper/*"
envsubstfiles "./config/hydra/clients/*"
envsubstfiles "./config/hydra/policies/*"

echo "Executing bootstrap scripts..."

export CLUSTER_URL=$HYDRA_URL
export CLIENT_ID=$HYDRA_ROOT_CLIENT_ID
export CLIENT_SECRET=$HYDRA_ROOT_CLIENT_SECRET

backoff ./scripts/services/oathkeeper.sh $OATHKEEPER_API_URL "./config/oathkeeper"
backoff ./scripts/services/keto.sh $KETO_URL "./config/oathkeeper"
backoff ./scripts/services/hydra.sh "./config/hydra"
