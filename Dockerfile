FROM fedora:latest

LABEL version="1.0"
LABEL description="The frontend of my Homeautomatizaion"

EXPOSE 3000

RUN dnf -y update && dnf -y install npm && dnf clean all

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install -g serve; npm install
COPY . /usr/src/app/

# Prepare the production build
RUN npm run build

CMD [ "serve", "-s", "build", "-p", "3000" ]
