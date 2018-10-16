if [ "$1" == "nocontainer" ]; then
  echo "Starting new container.."
else
  echo "Restarting container.."
  docker stop teamboosted-database && docker rm -f teamboosted-database
fi
docker pull danielkang674/teamboosted-database:latest && docker run --name teamboosted-database -p 8081:8081 --network br0 --env-file .env -d danielkang674/teamboosted-database:latest