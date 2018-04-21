#!/bin/bash

set -euo pipefail

cd "$( dirname "${BASH_SOURCE[0]}" )"

ls -la

echo "Sourcing helpers..."
source ./scripts/helper/retry.sh
source ./scripts/helper/envsubstfiles.sh
source ./scripts/helper/getid.sh

echo "Substituting environment variables"
envsubstfiles "./config/hydra/clients/*"
envsubstfiles "./config/keto/policies/*"
envsubstfiles "./config/oathkeeper/rules/*"

echo "Executing bootstrap scripts..."

hydra_url=$HYDRA_ISSUER
oathkeeper_url=$OATHKEEPER_API_URL
keto_url=$KETO_URL

export CLUSTER_URL=${hydra_url%/}/
export CLIENT_ID=$HYDRA_SUBJECT_PREFIX$HYDRA_FORCE_ROOT_CLIENT_ID
export CLIENT_SECRET=$HYDRA_FORCE_ROOT_CLIENT_SECRET

backoff ./scripts/services/hydra.sh "./config/hydra"
backoff ./scripts/services/oathkeeper.sh ${oathkeeper_url%/}/ "./config/oathkeeper"
backoff ./scripts/services/keto.sh ${keto_url%/}/ "./config/keto"
