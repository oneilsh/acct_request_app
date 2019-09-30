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
mkdir -p /home/shared

addgroup instructors
addgroup students

cp acct_manage_users /usr/local/sbin
cp acct_request_app.service /etc/systemd/system

cp add_request.py /opt/acct_request_app
cp app.js /opt/acct_request_app
cp package.json /opt/acct_request_app
cp -r public /opt/acct_request_app
cp user_requests.db /opt/acct_request_app

npm install --prefix /opt/acct_request_app/

chown -R www-data:www-data /opt/acct_request_app

systemctl enable acct_request_app
systemctl start acct_request_app
