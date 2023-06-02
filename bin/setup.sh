#!/bin/bash

set -e

function dc() {
  docker compose "$@"
}

dc down -vt 1

dc up -d

dc exec app bin/install.sh
