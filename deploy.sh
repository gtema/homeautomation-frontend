#!/bin/bash

REACT_APP_API_HOST=fast-savannah-53552.herokuapp.com REACT_APP_API_PATH=/api/v0/stock/ REACT_APP_API_AUTH=/auth npm run build
rsync -av --del build/* pi:/var/www/html
