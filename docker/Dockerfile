FROM ghcr.io/astral-sh/uv:python3.13-bookworm

ADD . /app
WORKDIR /app
RUN uv sync

RUN apt update && apt install -y nginx
COPY ./docker/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80 
 
COPY ./docker/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]
