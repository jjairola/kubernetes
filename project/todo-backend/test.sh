#!/bin/bash

# Test 1: Empty todo (should return 400 "Text is required")
echo "Test 1: Empty todo"
curl -X POST -H "Content-Type: application/json" -d '{}' http://localhost:3001/todos
echo

# Test 2: Normal todo (should return 201)
echo "Test 2: Normal todo"
curl -X POST -H "Content-Type: application/json" -d '{"text":"Buy groceries"}' http://localhost:3001/todos
echo

# Test 3: Todo over 140 characters (should return 400 "Todo text must be 140 characters or less")
echo "Test 3: Todo over 140 chars"
long_text=$(printf 'a%.0s' {1..141})
curl -X POST -H "Content-Type: application/json" -d "{\"text\":\"$long_text\"}" http://localhost:3001/todos
