# README

This project implements frontend for [MyAutomation project](github.com/gtema/homeautomation)

# Quick summary

A web frontend based on Redux + React bundled using npm

## How do I set things up

`npm install`

### Configuration

The following configuration variables are supported:

- **REACT_APP_API_HOST** - host and port of the API. Default is *localhost:5000*
- **REACT_APP_API_PATH** - path of the api. Default is */api/v0/stock*
- **REACT_APP_API_AUTH_PATH** - authorization url. Default is */auth*
- **REACT_APP_API_HTTPS** - is set *https* will be used to access API


## Testing

`npm run test`

## Preparing production build

- set configuration variables as environment variables correspondingly
- `npm run build`
