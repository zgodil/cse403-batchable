set -o allexport
. ../vars.env
set +o allexport
./mvnw clean verify
