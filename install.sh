#!/bin/bash
if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root" 
   exit 1
fi

# needed packages
sudo apt install libssl1.0-dev -y
sudo apt install nodejs-dev -y
sudo apt install node-gyp -y
apt-get install npm -y
apt-get install nodejs -y
apt-get install sqlite3 -y

mkdir -p /opt/acct_request_app/deleted_account_data
mkdir -p /home/shared/local/bin
mkdir -p /home/shared/data
mkdir -p /home/shared/everyone

addgroup instructors
cat instructors_sudoers >> /etc/sudoers
addgroup students

chown -R root:instructors /home/shared
chown -R root:students /home/shared/everyone
chmod -R 755 /home/shared
chmod -R 770 /home/shared/everyone

cp acct_manage_users /usr/local/sbin
cp acct_request_app.service /etc/systemd/system

# files for /opt/acct_request_app
cp -r add_request.py \
  app.js \
  package.json \
  public \
  user_requests.db \
  config.json \
  auto_sourced_by_bashrcs \
     /opt/acct_request_app/

npm install --prefix /opt/acct_request_app/

chown -R www-data:www-data /opt/acct_request_app

systemctl enable acct_request_app
systemctl start acct_request_app
