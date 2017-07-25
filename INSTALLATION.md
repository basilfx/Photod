# Installation
This application has been tested on Ubuntu 17.04 and macOS 10.12.s

## Development
There are several ways to run Photod for development. During development, a separate Webpack development server will serve the `bundle.js` file via `http://localhost:8000`. The Django development server will serve via http://localhost:7000.

### Using Docker
The easiest way of running Photod is by using Docker. The provided Dockerfile will provide you with an environment that includes all dependencies.

```bash
docker build . --tag photod:latest

# Copy settings template (modify to your own needs).
cp photod-backend/photod/settings/local.py.default photod-backend/photod/settings/local.py

# Initial setup.
docker run --rm -ti -u `id -u` -v `pwd`:`pwd` -w `pwd` photod:latest init
docker run --rm -ti -u `id -u` -v `pwd`:`pwd` -w `pwd` photod:latest backend migrate
docker run --rm -ti -u `id -u` -v `pwd`:`pwd` -w `pwd` photod:latest backend createsuperuser

# Enrolling media files from /path/to/media.
docker run --rm -ti -u `id -u` -v `pwd`:`pwd` -v /path/to/media:/path/to/media -w `pwd` photod:latest backend enroll /path/to/media
docker run --rm -ti -u `id -u` -v `pwd`:`pwd` -w `pwd` photod:latest backend process

# Run the development servers (auto-reload).
docker run --rm -ti -p 7000:7000 -u `id -u` -v `pwd`:`pwd` -w `pwd` photod:latest backend runserver 0:7000
docker run --rm -ti -p 8000:8000 -u `id -u` -v `pwd`:`pwd` -w `pwd` photod:latest frontend run start

# Build frontend
docker run --rm -ti -p 8000:8000 -u `id -u` -v `pwd`:`pwd` -w `pwd` photod:latest frontend run build-production
```

## Deployment
The recommended setup is using Nginx, uWSGI, PostgreSQL and Redis.

### Configuring Nginx
Use the optimizations below to speed-up the transfer of resources. This will enable serving of pre-compressed GZIP files (if available) and use X-Accel to offload the uWSGI workers for transferring files.

```nginx
server {
    ...

    # Django static.
    location /static {
        ...
        gzip_static on;
    }

    # Sendfile (this will expose your whole filesystem, but you need this if
    # your files are spread across your system).
    location /_internal/ {
        alias /;
        internal;
    }

    ...
}
```
