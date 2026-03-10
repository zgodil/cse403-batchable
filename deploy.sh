echo "=== Closing Old Server ==="
screen -wipe
screen -XS server quit
set -e
echo "=== Retrieving New Version ==="
git pull
echo "=== Building Front-End ==="
./build.sh
echo "=== Running Back-End ==="
screen -md -S server ./run.sh
echo "=== Done! ==="
echo "Visit https://batchable.org"
