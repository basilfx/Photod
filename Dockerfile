FROM ubuntu:17.04

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y curl git apt-utils

RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y build-essential gdal-bin libavcodec-dev \
        libavdevice-dev libavfilter-dev libavformat-dev libavresample-dev \
        libavutil-dev libboost-python-dev libjpeg-dev libleptonica-dev \
        libsqlite3-mod-spatialite libswscale-dev libtesseract-dev nodejs \
        python3 python3-dev python3-pip python3-venv tesseract-ocr \
        tesseract-ocr-all && \
    npm install -g yarn

RUN apt-get clean

COPY docker/entry_point.sh /entry_point.sh

ENTRYPOINT ["/entry_point.sh"]
