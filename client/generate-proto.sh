#!/bin/bash

# Create the output directory
mkdir -p src/lib/gen

# Clean the output directory first
rm -rf src/lib/gen/*

# Generate TypeScript code using Connect protoc plugins
npx protoc \
  --plugin=protoc-gen-es=./node_modules/.bin/protoc-gen-es \
  --plugin=protoc-gen-connect-es=./node_modules/.bin/protoc-gen-connect-es \
  --es_out=src/lib/gen \
  --es_opt=target=ts \
  --connect-es_out=src/lib/gen \
  --connect-es_opt=target=ts \
  --proto_path=../server/proto \
  ../server/proto/*.proto

echo "Protobuf generation complete!" 