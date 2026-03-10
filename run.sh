npm run db:up
cd backend
set -o allexport
. ../vars.env
set +o allexport
./mvnw spring-boot:run
