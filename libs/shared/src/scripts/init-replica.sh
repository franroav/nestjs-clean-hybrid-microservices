#!/bin/bash
# Wait until MongoDB is ready
until mongo --eval "print(\"waited for connection\")"
do
  sleep 5
done

# Initiate the replica set
mongo --eval 'rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "mongodb-primary:27017" },
    { _id: 1, host: "mongodb-secondary:27017" },
    { _id: 2, host: "mongodb-arbiter:27017", arbiterOnly: true }
  ]
})'