#!/bin/bash

alias l='ls -lah'
alias he='yarn helium'

function compiledeploy() {
  yarn helium compile
  yarn helium deploy
}

function writeseeds() {
	node helium/writeSeeds.js
}