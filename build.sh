FRONTEND_BUILD="./frontend/build/client"
BACKEND_BUILD="./backend/src/main/resources/static"
cd frontend
npm install
npm run build
rm -rf "$BACKEND_BUILD"
mkdir "$BACKEND_BUILD"
cp -r "$FRONTEND_BUILD"/* "$BACKEND_BUILD"
# npm run db:up
