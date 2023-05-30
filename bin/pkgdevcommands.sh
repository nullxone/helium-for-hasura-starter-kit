#!/bin/bash

# scripts for developing the helium starter kit framework

function setupdev() {
  cd ../helium-for-hasura
  yarn link
  cd ../app
  yarn add link:../helium-for-hasura
  yarn link helium-for-hasura
}