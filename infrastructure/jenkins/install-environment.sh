#!/usr/bin/env bash

# Add jessie-backports
echo $'\n#backports\n' | sudo tee -a /etc/apt/sources.list
echo "deb http://http.debian.net/debian jessie-backports main" | sudo tee -a /etc/apt/sources.list
sudo apt-get update

# linux utils install
sudo apt-get install -y zip

# java install
aptitude -y -t jessie-backports install openjdk-8-jdk
lastJavaHome=$(find /usr/lib/jvm -maxdepth 1 -type d -name '*openjdk*' | head -n 1)
echo "export JAVA_HOME=$lastJavaHome" | tee -a /etc/profile.d/environment.sh
echo 'PATH=$PATH:$JAVA_HOME/bin' | tee -a /etc/profile.d/environment.sh

# SBT install
echo "deb https://dl.bintray.com/sbt/debian /" | sudo tee -a /etc/apt/sources.list.d/sbt.list
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2EE0EA64E40A89B84B2DF73499E82A75642AC823
sudo apt-get update
sudo apt-get install -y sbt

# nodeJs install
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt-get install -y nodejs
#sudo apt-get install -y build-essential
sudo npm install -g angular-cli@1.0.0-beta.24

# jfrog-CLI install and configure
CURRENT_DIR=$(pwd)
sudo mkdir /opt/jfrog
cd /opt/jfrog
curl -fL https://getcli.jfrog.io | sudo sh
sudo ln -s /opt/jfrog/jfrog /usr/bin/jfrog
sudo chmod a+x /opt/jfrog/jfrog
sudo -i -u jenkins jfrog rt config --url=http://artifactory.effectivelang.com:8081/artifactory --user=admin --password=admin
cd $CURRENT_DIR
