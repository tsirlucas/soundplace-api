#!/usr/bin/env bash -e

PACKAGE_VERSION=$1
NPM version ${PACKAGE_VERSION#*v} --no-git-tag-version
