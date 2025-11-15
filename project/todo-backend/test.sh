#!/bin/bash

echo "Test 1: Empty todo"
curl -X POST -H "Content-Type: application/json" -d '{}' http://localhost:3001/todos
echo

echo "Test 2: Normal todo"
curl -X POST -H "Content-Type: application/json" -d '{"text":"Buy groceries"}' http://localhost:3001/todos
echo

echo "Test 3: Todo over 140 chars"
long_text=$(printf 'a%.0s' {1..141})
curl -X POST -H "Content-Type: application/json" -d "{\"text\":\"$long_text\"}" http://localhost:3001/todos
echo

echo "Test 4: Update todo to done"
# First create a todo to update
create_response=$(curl -s -X POST -H "Content-Type: application/json" -d '{"text":"Test update"}' http://localhost:3001/todos)
todo_id=$(echo $create_response | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
if [ -n "$todo_id" ]; then
  echo "Created todo with ID: $todo_id"
  curl -X PUT -H "Content-Type: application/json" -d '{"done":true}' http://localhost:3001/todos/$todo_id
  echo
else
  echo "Failed to create todo for update test"
fi
