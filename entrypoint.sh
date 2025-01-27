#!/bin/sh


envsubst '\
    \${AUTHENTICATION_SERVICE_NAME} \${AUTHENTICATION_SERVICE_PORT}' < /etc/nginx/conf.d/nginx.conf.template > /etc/nginx/nginx.conf

# Start Nginx
exec "$@"