npm run db:up
cd backend
set -o allexport
source ../vars.env
set +o allexport
./mvnw spring-boot:run
