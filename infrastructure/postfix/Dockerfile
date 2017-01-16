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

## Remove exim
RUN apt-get remove -y exim4

######################################## Add Postfix ##########################################
## Install postfix
RUN apt-get -y install postfix

## Configure postfix
RUN postconf -e "myorigin=localhost.com"
RUN postconf -e "mynetworks_style=host"
RUN postconf -e "mynetworks=127.0.0.1/32 [::1]/128"
RUN postconf -e "myhostname=localhost.com"
RUN postconf -e "mydomain=localhost.com"
RUN postconf -e "smtpd_banner=localhost.com ESMTP"
RUN postconf -e "local_recipient_maps=$alias_maps"

RUN postconf -e "inet_interfaces=all"
RUN postconf -e "inet_protocols=all"
RUN postconf -e "mydestination=localhost.com, localhost, localhost.localdomain"

RUN postconf -e "smtpd_use_tls=yes"
RUN postconf -e "smtpd_tls_cert_file=/etc/postfix/ssl-certificates/cert.pem"
RUN postconf -e "smtpd_tls_key_file=/etc/postfix/ssl-certificates/privkey.pem"
RUN postconf -e "smtpd_tls_session_cache_database=btree:/var/lib/postfix/smtpd_scache"
RUN postconf -e "smtpd_tls_security_level=may"
RUN postconf -e "smtp_tls_security_level=may"
RUN postconf -e "smtpd_tls_protocols=!SSLv2, !SSLv3"

RUN postconf -e "biff=no"
RUN postconf -e "strict_rfc821_envelopes=yes"
RUN postconf -e "disable_vrfy_command=yes"
RUN postconf -e "smtpd_helo_required=yes"

# Set aliases
COPY aliases /etc/aliases
######################################## Add /Postfix #########################################

######################################## Add Dovecot ##########################################
## Install Dovecot
RUN apt-get install -y dovecot-core dovecot-imapd dovecot-lmtpd

## Add config to postfix
COPY master.cf /etc/postfix
RUN postconf -e "mydestination=mail.localhost.com, localhost, localhost.localdomain"

RUN postconf -e "smtpd_sasl_type=dovecot"
RUN postconf -e "smtpd_sasl_path=private/auth"
RUN postconf -e "smtpd_sasl_auth_enable=yes"
RUN postconf -e "smtpd_sasl_security_options=noanonymous"

RUN postconf -e "virtual_mailbox_domains=localhost.com"
RUN postconf -e "virtual_alias_maps=hash:/etc/postfix/virtual"
RUN postconf -e "virtual_transport=lmtp:unix:private/dovecot-lmtp"
RUN postconf -e "smtpd_recipient_restrictions=reject_unauth_destination, reject_unverified_recipient, permit"

# Set virtual aliases
COPY virtual_aliases /etc/postfix/virtual

## Configure dovecot
COPY dovecot.conf /etc/dovecot/dovecot.conf

## Add 'vmail' user for all mails
RUN useradd -s /bin/bash vmail;\
    mkdir /home/vmail;\
    chown vmail:vmail /home/vmail
######################################## Add /Dovecot #########################################

######################################## Add Logs #############################################
## Install rsyslog
RUN apt-get -y install rsyslog
COPY rsyslog.conf /etc/rsyslog.conf

## Dovecot logs to separate file
#RUN echo "log_path = /var/log/dovecot.log" > /etc/dovecot/dovecot.conf

## Improve dovecot logs detalisation
#RUN echo "auth_verbose = yes" > /etc/dovecot/dovecot.conf
#RUN echo "mail_debug = yes" > /etc/dovecot/dovecot.conf
######################################## /Add Logs ############################################

## Copy ssl certivecates and private keys for postfix, dovecot and DKIM
COPY ./ssl-certificates /etc/postfix/ssl-certificates

## Add virtual email users
RUN echo admin@localhost.com:$(doveadm pw -s ssha512 -p 1234):::::: >> /etc/dovecot/users
RUN echo support@localhost.com:$(doveadm pw -s ssha512 -p 1234):::::: >> /etc/dovecot/users
RUN echo user@localhost.com:$(doveadm pw -s ssha512 -p 1234):::::: >> /etc/dovecot/users
RUN echo robot@localhost.com:$(doveadm pw -s ssha512 -p 1234):::::: >> /etc/dovecot/users

VOLUME  ["/home/vmail", "/var/log"]

## Start
CMD service rsyslog start;\
    newaliases;\
    postmap /etc/postfix/virtual;\
    postfix start;\
    service dovecot restart;\
    bash
