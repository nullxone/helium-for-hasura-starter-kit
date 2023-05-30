#!/bin/bash

alias l='ls -lah'
alias he='yarn helium'
alias psql='docker compose exec database psql -U dbuser appdb'

function compiledeploy() {
  yarn helium compile
  yarn helium deploy
}
