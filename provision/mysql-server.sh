#!/bin/bash

package="mysql-server-<version>"
question="mysql-server/root_password"
password="password"

if [[ ! -f /usr/sbin/mysqld ]]; then
  debconf-set-selections <<< "${package} ${question} password ${password}"
  debconf-set-selections <<< "${package} ${question}_again password ${password}"
  apt-get -y install mysql-server libmysqlclient-dev
fi
