#!/bin/bash -e

OPTION="$1"
shift

# Check if an option is specified.
if [[ -z $OPTION ]]; then
    echo "Usage: $0 <init|backend|frontend>"
    exit 0
fi

# This script must be run in the project root folder.
if [ ! -d "photod-backend" ]; then
    echo "The source directory is not mounted."
    exit 1
fi

# Parse option and execute action.
case $OPTION in
    init)
        (cd photod-backend && python3 -m venv env && source env/bin/activate && pip install -r requirements.txt)
        (cd photod-frontend && yarn)
    ;;
    backend)
        (cd photod-backend && source env/bin/activate && ./manage.py $@)
    ;;
    frontend)
        (cd photod-frontend && yarn $@)
    ;;
    *)
        echo "Unknown option: $OPTION"
        exit 1
    ;;
esac
