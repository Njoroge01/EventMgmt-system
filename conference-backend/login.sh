#!/bin/bash

read -p "Username: " USERNAME
read -s -p "Password: " PASSWORD
echo

RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}")

echo "$RESPONSE"
