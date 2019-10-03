#!/usr/bin/env python2
import sys
import io
import argparse
import sqlite3
import subprocess
import pwd
import re


def parse_args():
    parser = argparse.ArgumentParser(description='Puts a new account request in the account request database. May fail if username exists already has an account, or is already in the requests db.')
    parser.add_argument(dest = "first", help = "First Name")
    parser.add_argument(dest = "last", help = "Last Name")
    parser.add_argument(dest = "email", help = "Contact Email")
    parser.add_argument(dest = "username", help = "Requested Username")
    parser.add_argument(dest = 'password', help = "Requested password. It will be encrypted before entry into the database.")
    parser.add_argument('--database', default = "/opt/acct_request_app/user_requests.db", dest = 'database', help = "sqlite3 database file to use. Must have the correct schema.")
    parser.add_argument('--other', required = False, default = "NA", dest = "other", help = "Optional freeform text to go along with the request.")

    return parser.parse_args()


args = parse_args()


def user_exists(username):
    found = False
    try:
        pwd.getpwnam(username)
        found = True
    except KeyError:
        pass

    if username == "root" or username == "shared" or username == "all":
        found = True

    return found


username = args.username
first = args.first
last = args.last
email = args.email
password = args.password
other = args.other
if args.other == "":
  other = "NA"

dbfile = args.database



###### Check formatting (using same rules as manage_users.py, which actually creates the accounts)
if not re.match(r"^[a-zA-Z0-9_-]+$", username) or not re.match(r"^[a-zA-Z]$", username[0]):
    sys.stderr.write("Usernames cannot be empty, and can only be letters, numbers, underscores, and dashes, and must start with a letter. Request not processed. (" + username + ")\n")
    sys.exit(1)

# handy for working with international characters: https://www.daveoncode.com/2015/02/05/regex-regular-expressions-in-python-how-to-match-english-and-non-english-letters/
name_regex = re.compile(r"^([^\W]|[0-9\' -])+$", re.IGNORECASE | re.UNICODE)
if not name_regex.match(first) or not name_regex.match(last):
    sys.stderr.write("First and last names can not be empty, and can only contain letters, numbers, spaces, dashes, and single quotes. Request not processed. (" + first + " " + last + ")\n")
    sys.exit(1)

if not re.match(r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)", email):
    sys.stderr.write("Email address not valid-looking. Request not processed. (" + email + ")\n")
    sys.exit(1)


# check existing users
if user_exists(username):
    sys.stderr.write("Error: username invalid or already taken. Choose another.\n")
    sys.exit(1)


# check existing requests and emails
db = sqlite3.connect(dbfile)
cursor = db.cursor()
cursor.execute('''SELECT * from requests where username = '{0}';'''.format(username))
rowusername = cursor.fetchone()
cursor.execute('''SELECT * from requests where email = '{0}';'''.format(email))
rowemail = cursor.fetchone()
db.close()

if rowusername != None:
    sys.stderr.write("Error: username invalid or already taken. Choose another.\n")
    sys.exit(1)

if rowemail != None:
    sys.stderr.write("Error: email invalid or already taken. Choose another.\n")
    sys.exit(1)

cryptedpass = subprocess.check_output(['/usr/bin/openssl', 'passwd', '-1', password])
cryptedpass = cryptedpass.strip()


# ok, create the request
db = sqlite3.connect(dbfile)
cursor = db.cursor()
cursor.execute('''INSERT into requests (first_name, last_name, email, username, cryptedpass, processed, other) values (?, ?, ?, ?, ?, ?, ?);''', (first, last, email, username, cryptedpass, 'no', other))
db.commit()
db.close()

print("Success!")
