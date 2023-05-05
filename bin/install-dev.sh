#!/bin/bash

set -e

cd /helium-for-hasura
yarn link

cd /app
yarn add ../helium-for-hasura
yarn link helium-for-hasura