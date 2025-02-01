#!/bin/sh



envsubst '\
    \${AUTHENTICATION_SERVICE_NAME} \${AUTHENTICATION_SERVICE_PORT} \
    ${CRYPTOMARKET_SERVICE_NAME} \${CRYPTOMARKET_SERVICE_PORT}
    \${USER_MANAGEMENT_SERVICE_NAME} \${USER_MANAGEMENT_SERVICE_PORT}'< /etc/nginx/conf.d/nginx.conf.template > /etc/nginx/nginx.conf

# Start Nginx
exec "$@"