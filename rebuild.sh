if [ "$1" == "nocontainer" ]; then
  echo "Starting new container.."
else
  echo "Restarting container.."
  docker stop teamboosted-database && docker rm -f -v teamboosted-database
fi
docker build -t teamboosted-database . && docker run --name teamboosted-database -p 8081:8081 --network br0 --env-file .env -d teamboosted-database