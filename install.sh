#!/bin/bash
if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root" 
   exit 1
fi

# needed packages
#apt install libssl1.0-dev -y
#apt install nodejs-dev -y
#apt install node-gyp -y
#apt install npm -y
#apt install nodejs -y
#apt install sqlite3 -y
#apt install python-pip -y
#pip install sendgrid

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

if [ -f "/opt/acct_request_app/user_requests.db" ]; then 
  cp /opt/acct_request_app/user_requests.db /opt/acct_request_app/user_requests.db.backup_`date -Iseconds`
else 
  echo "uh..."
fi

cp -r add_request.py \
  app.js \
  package.json \
  public \
  skel \
  user_requests.db \
  config.json \
  auto_sourced_by_bashrcs \
     /opt/acct_request_app/

npm install --prefix /opt/acct_request_app/

chown -R www-data:www-data /opt/acct_request_app

systemctl enable acct_request_app
systemctl restart acct_request_app
systemctl status acct_request_app
