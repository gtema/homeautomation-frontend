#!/bin/bash

npm run build

cp -rT build /var/www/html

chown -R apache:apache /var/www/html
chmod 774 /var/www/html

/run-apache.sh
