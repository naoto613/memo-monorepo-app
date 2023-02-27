CREATE DATABASE IF not exists `test_database`;

CREATE USER 'test_user' identified by 'password';

GRANT ALL on test_database.* to 'test_user';
