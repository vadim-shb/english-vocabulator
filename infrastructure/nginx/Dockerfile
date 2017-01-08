FROM debian

ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update

## Set Timezone to UTC
RUN echo "UTC" > /etc/timezone;\
    dpkg-reconfigure -f noninteractive tzdata

## Set LOCALE to en_US.UTF8
RUN apt-get install -y locales;\
    sed -i -e 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen;\
    echo 'LANG="en_US.UTF-8"'>/etc/default/locale;\
    dpkg-reconfigure --frontend=noninteractive locales;\
    update-locale LANG=en_US.UTF-8

## Install nginx
RUN apt-get -y install nginx-full

## Configure nginx
RUN rm -rf /etc/nginx/sites-enabled/default
COPY ./nginx.conf /etc/nginx/
#COPY ./sites-enabled/vocabulator /etc/nginx/sites-enabled/vocabulator

#TODO: add logging and may be output configuration
#VOLUME ["/docker/nginx/sites-enabled:/etc/nginx/sites-enabled", "/docker/nginx/certs:/etc/nginx/certs", "/docker/nginx/conf.d:/etc/nginx/conf.d", "/docker/nginx/log:/var/log/nginx"]
#VOLUME ["/etc/nginx/sites-enabled", "/etc/nginx/certs", "/var/log/nginx", "/var/www/html"]

CMD nginx