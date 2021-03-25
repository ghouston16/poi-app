
### Installation:

- Download [node](https://nodejs.org/en/download/) for your operating system
- Create `.env` file in root project directory and add the following properties.

db=<mongoDB database>
cookie_name=<poi-web>
cookie_password=<secretpasswordnotrevealedtoanyone>

### Dependencies:

run npm install to install package dependencies:

 "dependencies": {
    "@hapi/boom": "^9.1.1",
    "@hapi/cookie": "^11.0.2",
    "@hapi/hapi": "^20.1.0",
    "@hapi/inert": "^6.0.3",
    "@hapi/joi": "^17.1.1",
    "@hapi/vision": "^6.0.1",
    "axios": "^0.21.1",
    "dot": "^1.1.3",
    "dotenv": "^8.2.0",
    "env": "0.0.2",
    "handlebars": "^4.7.6",
    "joi": "^17.4.0",
    "mais-mongoose-seeder": "^1.0.7",
    "mongoose": "^5.12.0"
  },
  "devDependencies": {
    "cloudinary": "^1.25.1",
    "prettier": "^2.2.1"
  }
  
  Run index.js in IDE to start app