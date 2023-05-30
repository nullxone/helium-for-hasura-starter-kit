#!/bin/bash

set -e

function dc() {
  docker compose "$@"
}

dc down -vt 1
