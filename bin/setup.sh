#!/bin/bash

set -e

function dc() {
  docker compose "$@"
}

dc down -vt 1

dc up -d

dc exec app yarn
dc exec app yarn helium compile
dc exec app yarn helium deploy
