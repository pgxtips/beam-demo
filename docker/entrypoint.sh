#!/bin/sh
set -e

nginx &
uv run gunicorn -b 0.0.0.0:8080 app:APP_SERVER
