# syntax=docker/dockerfile:1.6
# MRO HRIS — single-image backend (Nginx + PHP-FPM + queue worker + scheduler).
# Built for Railway. Supports both MySQL and PostgreSQL via DB_URL/DATABASE_URL.

# ---------- Stage 1: composer dependencies ----------
FROM composer:2 AS vendor

WORKDIR /app
ENV COMPOSER_ALLOW_SUPERUSER=1

COPY composer.json composer.lock ./
RUN composer update \
        --no-dev \
        --no-scripts \
        --no-autoloader \
        --prefer-dist \
        --no-interaction \
        --no-progress \
        --ignore-platform-reqs

COPY . .
RUN composer dump-autoload --optimize --classmap-authoritative --no-dev

# ---------- Stage 2: runtime ----------
FROM php:8.3-fpm-alpine AS app

ENV APP_HOME=/var/www/html

RUN apk add --no-cache \
        nginx \
        supervisor \
        bash \
        tini \
        icu-libs \
        libpng \
        libjpeg-turbo \
        libwebp \
        libzip \
        oniguruma \
        libxml2 \
        postgresql-client \
        mariadb-client \
    && apk add --no-cache --virtual .build-deps \
        $PHPIZE_DEPS \
        icu-dev \
        libpng-dev \
        libjpeg-turbo-dev \
        libwebp-dev \
        libzip-dev \
        oniguruma-dev \
        libxml2-dev \
        postgresql-dev \
    && docker-php-ext-configure gd --with-jpeg --with-webp \
    && docker-php-ext-install -j"$(nproc)" \
        pdo_mysql \
        pdo_pgsql \
        gd \
        exif \
        intl \
        mbstring \
        zip \
        bcmath \
        opcache \
        pcntl \
    && apk del .build-deps \
    && rm -rf /var/cache/apk/* /tmp/*

WORKDIR $APP_HOME

COPY docker/php.ini       /usr/local/etc/php/conf.d/zz-app.ini
COPY docker/php-fpm.conf  /usr/local/etc/php-fpm.d/zz-app.conf
COPY docker/nginx.conf    /etc/nginx/nginx.conf
COPY docker/supervisord.conf /etc/supervisord.conf
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh \
    && mkdir -p /run/nginx /run/php

COPY --from=vendor /app $APP_HOME

RUN mkdir -p \
        $APP_HOME/storage/framework/cache \
        $APP_HOME/storage/framework/sessions \
        $APP_HOME/storage/framework/views \
        $APP_HOME/storage/logs \
        $APP_HOME/storage/app/public \
        $APP_HOME/bootstrap/cache \
    && chown -R www-data:www-data $APP_HOME/storage $APP_HOME/bootstrap/cache \
    && chmod -R 775 $APP_HOME/storage $APP_HOME/bootstrap/cache

EXPOSE 8080

ENTRYPOINT ["/sbin/tini", "--", "/usr/local/bin/entrypoint.sh"]
CMD ["supervisord", "-c", "/etc/supervisord.conf"]
