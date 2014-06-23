#!/bin/bash

if [[ ! -d /usr/lib/postgresql/9.3/ ]]; then
  apt-get -y install postgresql-9.3 postgresql-server-dev-9.3
  locale-gen ja_JP.UTF-8
  service postgresql restart
  su - postgres -c "
    psql -c \"UPDATE pg_database SET datistemplate=false WHERE datname='template1'\"
    psql -c \"DROP DATABASE template1\"
    psql -c \"CREATE DATABASE template1 WITH TEMPLATE = template0 ENCODING = 'UTF8'\"
    psql -c \"UPDATE pg_database SET datistemplate=true WHERE datname='template1'\"
    createuser -d -S -R vagrant
  "
fi
