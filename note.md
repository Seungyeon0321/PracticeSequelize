I also need to install the driver that corresponds to the database you will be connecting to.
npm install mysql2
npm install mariadb
npm install sqlite3 등등

Hashing vs Encryption

- Passwords are still the primary way authentication is used online.
- Passwords can be protected with encryption or hashing.
- Encryption is a two-way function. What is encrypted can be decrypted with the proper key.
- Hashing is a one-way function that produces a unique message digest. There is no way to reverse a hash.
- A hacker who steals hashed passwords can only guess the password.

What is a Buffer?

- A Buffer is a small physical location in your computer, usually the RAM, where data is stored temporarily
- I node, a Buffer is raw memory allocated outside V8.
- V8 is the Javascript Engine inside Node that parses and runs JavaScript code.
- There is a Buffer class in Node designed to handle raw Binary data
- The integers in a buffer each represent a byte thus are limited to values from 0 to 255.
