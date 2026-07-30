# FitConnect Backend

Django REST API for FitConnect. See the [root README](../README.md) for the full setup guide,
features, and screenshots — this file just covers backend-specific notes.

## Quick start

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # then set SECRET_KEY (and DB_* vars if not using SQLite)
python manage.py makemigrations FitConnect
python manage.py migrate
python manage.py loaddata dumpeddata.json
python manage.py runserver
```

By default `.env.example` sets `USE_SQLITE=True`, which needs no database server. To run against
MySQL instead, set `USE_SQLITE=False` and fill in the `DB_*` variables — see `.env.example` for
the full list.
