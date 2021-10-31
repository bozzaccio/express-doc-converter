#!/bin/bash

echo "install libre office....."

apk add libreoffice
apk update

echo "verifying installation...."

apk search libreoffice
