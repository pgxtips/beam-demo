# Beam Demo

A lightweight demo app for showcasing the Beam recommendation engine.
This app allows users to go through a guided experience that includes preference 
selection, video recommendations (assisted and random), and a feedback survey.

## Features

- Interactive session with preferences and video engagement
- Two-phase video recommendations (engine-driven and random)
- Containerised with Docker for deployment

---

## Getting Started

### Prerequisites

- Python 3.13
- [uv](https://github.com/astral-sh/uv) (a faster Python package manager)
- Docker (optional for containerization)

---

## Development

Install dependencies:

```bash
uv sync
```

Start the development server (port 8080):

```bash
uv run dev.py
```

---

## Production

Run with `gunicorn` behind `uv`:

```bash
uv run gunicorn -b 0.0.0.0:8080 app:APP_SERVER
```

---

## Docker

### Build the Docker image:

```bash
docker build -t beam-demo -f docker/Dockerfile .
```

### Run the container:

```bash
docker run -p 8080:80 beam-demo
```

---

## Environment Variables

| Variable    | Description                     | Default                 |
| ----------- | ------------------------------- | ----------------------- |
| `BEAM_HOST` | URL of the Beam backend service | `http://localhost:6969` |

Set it locally (e.g. in `.env`):

```bash
BEAM_HOST=http://localhost:6969
```

---
