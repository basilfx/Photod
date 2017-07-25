#!/bin/bash -e

OPTION="$1"

# Check if an option is specified.
if [[ -z $OPTION ]]; then
    echo "Usage: $0 <backend-[init|run|migrate]|frontend-[init|run|build]>"
    exit 0
fi

# This script must be run in the project root folder.
if [ ! -d "photod-backend" ]; then
    echo "The source directory is not mounted."
    exit 1
fi

# Parse option and execute action.
case $OPTION in
    backend-init)
        (cd photod-frontend && source env/bin/activate && pip install -r requirements.txt)
    ;;
    backend-run)
        (cd photod-backend && source env/bin/activate && ./manage.py runserver 0:7000)
    ;;
    backend-shell)
        (cd photod-backend && source env/bin/activate && ./manage.py shell_plus)
    ;;
    backend-migrate)
        (cd photod-backend && source env/bin/activate && ./manage.py migrate)
    ;;
    frontend-init)
        (cd photod-frontend && yarn)
    ;;
    frontend-run)
        (cd photod-frontend && yarn run start)
    ;;
    frontend-build)
        (cd photod-frontend && yarn run build-production)
    ;;
    *)
        echo "Unknown option: $OPTION"
        exit 1
    ;;
esac

# Exit successfully.
exit 0
