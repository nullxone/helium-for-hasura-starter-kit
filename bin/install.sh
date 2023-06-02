#!/bin/bash

set -e

yarn

if [[ -n $PROJECT_DIRECTORY ]]; then
  # integration testing
  cd "$PROJECT_DIRECTORY"
fi

yarn helium compile
yarn helium deploy