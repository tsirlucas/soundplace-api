#!/usr/bin/env bash -e

PACKAGE_VERSION=$1
yarn version ${PACKAGE_VERSION#*v} --no-git-tag-version
