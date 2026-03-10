function print_status() {
  printf "\e[35m=== $1 ===\e[0m\n"
}

print_status "Closing Old Server"
screen -wipe
screen -XS server quit
set -e
print_status "Retrieving New Version"
git pull
print_status "Building Front-End"
./build.sh
print_status "Running Back-End"
screen -md -S server ./run.sh
print_status "Done!"
echo "Visit https://batchable.org"
echo "It may take a few minutes to finish server startup..."
