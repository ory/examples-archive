#!/bin/bash

set -euo pipefail

function getid {
    filename=$1
    content=$(cat $filename | sed 's/\n|\r//')
    echo $content | grep '"id":' | sed 's/.\+"id":\s\+"\([^"]*\)".\+/\1/g'
}

function getclientid {
    filename=$1
    content=$(cat $filename | sed 's/\n|\r//')
    echo $content | grep '"client_id":' | sed 's/.\+"client_id":\s\+"\([^"]*\)".\+/\1/g'
}
