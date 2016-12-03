#!/bin/bash
{
google-chrome --kiosk "http://127.0.0.1:8000/"
}&
cd ~/git/arcadefrontend
. arcadefrontendenv/bin/activate
uwsgi --socket 0.0.0.0:8000 --protocol=http --ini=arcadefrontend.ini

