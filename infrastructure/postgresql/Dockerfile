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

## Install postgresql
ENV PG_VERSION=9.4
RUN apt-get -y install postgresql-${PG_VERSION} postgresql-client-${PG_VERSION}

## Configure postgresql
USER postgres
RUN echo "host all  all    0.0.0.0/0  md5" >> /etc/postgresql/${PG_VERSION}/main/pg_hba.conf;\
    echo "listen_addresses='*'" >> /etc/postgresql/${PG_VERSION}/main/postgresql.conf

## Create new user and database
USER postgres
RUN /etc/init.d/postgresql stop;\
    /etc/init.d/postgresql start;\
    psql --command "CREATE USER pguser WITH SUPERUSER PASSWORD '1234';";\
    createdb -O pguser -E UTF8 vocabulator

EXPOSE 5432

VOLUME  ["/etc/postgresql", "/var/log/postgresql", "/var/lib/postgresql"]

CMD /usr/lib/postgresql/${PG_VERSION}/bin/postgres -D /var/lib/postgresql/${PG_VERSION}/main -c config_file=/etc/postgresql/${PG_VERSION}/main/postgresql.conf