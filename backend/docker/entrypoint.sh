#!/bin/sh
set -e

APP_DIR="/var/www/html"
cd "$APP_DIR"

# Railway provides DATABASE_URL; Laravel reads DB_URL natively since v11.
if [ -n "$DATABASE_URL" ] && [ -z "$DB_URL" ]; then
    export DB_URL="$DATABASE_URL"
fi

# Ensure runtime-writable dirs exist
mkdir -p \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    storage/app/public \
    bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

# storage:link is idempotent; --force replaces a stale link
php artisan storage:link --force >/dev/null 2>&1 || true

# Detect DB driver from URL/env so we wait on the right port with the right tool
DB_SCHEME=""
DB_HOST_PARSED=""
DB_PORT_PARSED=""

if [ -n "$DB_URL" ]; then
    DB_SCHEME=$(printf '%s' "$DB_URL" | sed -nE 's|^([a-z]+)://.*|\1|p')
    DB_HOST_PARSED=$(printf '%s' "$DB_URL" | sed -E 's|^[^@]+@([^:/?]+).*|\1|')
    DB_PORT_PARSED=$(printf '%s' "$DB_URL" | sed -nE 's|^[^@]+@[^:]+:([0-9]+).*|\1|p')
elif [ -n "$DB_HOST" ]; then
    DB_SCHEME="${DB_CONNECTION:-mysql}"
    DB_HOST_PARSED="$DB_HOST"
    DB_PORT_PARSED="$DB_PORT"
fi

# Wait for the database to accept connections
if [ -n "$DB_HOST_PARSED" ]; then
    case "$DB_SCHEME" in
        postgres|postgresql|pgsql)
            DB_PORT_PARSED=${DB_PORT_PARSED:-5432}
            echo "[entrypoint] Waiting for PostgreSQL at $DB_HOST_PARSED:$DB_PORT_PARSED ..."
            i=0
            until pg_isready -h "$DB_HOST_PARSED" -p "$DB_PORT_PARSED" -q; do
                i=$((i+1))
                if [ "$i" -gt 30 ]; then
                    echo "[entrypoint] Postgres still not ready after 60s, continuing anyway"
                    break
                fi
                sleep 2
            done
            ;;
        mysql|mariadb)
            DB_PORT_PARSED=${DB_PORT_PARSED:-3306}
            echo "[entrypoint] Waiting for MySQL at $DB_HOST_PARSED:$DB_PORT_PARSED ..."
            i=0
            until mariadb-admin ping -h "$DB_HOST_PARSED" -P "$DB_PORT_PARSED" --silent 2>/dev/null; do
                i=$((i+1))
                if [ "$i" -gt 30 ]; then
                    echo "[entrypoint] MySQL still not ready after 60s, continuing anyway"
                    break
                fi
                sleep 2
            done
            ;;
        *)
            echo "[entrypoint] Unknown DB scheme '$DB_SCHEME' — skipping wait"
            ;;
    esac
fi

# Package discovery — composer install ran with --no-scripts
echo "[entrypoint] Discovering packages ..."
php artisan package:discover --ansi

# Filament assets (publishes vendor JS/CSS to public/) — safe even if Filament not installed
php artisan filament:assets --ansi 2>/dev/null || true

# Migrations (always safe — only applies what's pending)
echo "[entrypoint] Running migrations ..."
php artisan migrate --force --no-interaction

# Conditional seeding: only when DB is empty (prevents duplicate-data on every deploy)
# Set SEED_ON_EMPTY=false to disable entirely.
if [ "${SEED_ON_EMPTY:-true}" = "true" ]; then
    USER_COUNT=$(php artisan tinker --execute "echo \\App\\Models\\User::count();" 2>/dev/null | tail -n1 | tr -d '[:space:]')
    if [ "$USER_COUNT" = "0" ] || [ -z "$USER_COUNT" ]; then
        echo "[entrypoint] Empty database detected — seeding initial data ..."
        php artisan db:seed --force --no-interaction || true
    else
        echo "[entrypoint] Database already populated (users=$USER_COUNT) — skipping seed"
    fi
fi

# Spatie permissions cache reset (safe — rebuilt on next access)
php artisan permission:cache-reset >/dev/null 2>&1 || true

# Cache config/routes/views
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "[entrypoint] Boot complete — handing off to: $*"
exec "$@"
