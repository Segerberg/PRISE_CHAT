# PRISE CHAT
A support chat application for integration with qualtrics through embedding `<iframe>`
Used to communicate with research participants during live lab data collections in the PRISE research project

[https://www.gu.se/forskning/prise](https://www.gu.se/forskning/prise)

### Code
Prise chat uses a python flask backend with socket.io for message transport. The docker container fires up a gunicorn 
server with eventlet for socket support. 

### Features and limitations 
Prise chat was developed to tackle the impact of COVID-19 had on the project and hence the software is tailored to fit 
needs of Prise. If anyone want to enhance the application please feel free to make a pull request :sparkling_heart:

* Support for multiple users answering questions (implemented by a claim-chat feature)
* The application randomly suggests a user to claim a chat to monitor.
* It is not possible to save chats (This is a feature not a bug)
* The user model is extremely simple (But safe)
* Uses sqlalchemy ORM (defaults to sqlite but any other DB supported by the ORM should work out of the box)
* No internalization (Admin UI in english chatbox in Swedish )





# Deployment
PRISE CHAT is deployed for production in University of Gothenburgs
[openshift](https://www.redhat.com/en/technologies/cloud-computing/openshift) 
platform. Secure communication setting like TSL and CORS are configured with openshift routing. Please see 
[openshift docs](https://docs.openshift.com/container-platform/4.1/networking/routes/secured-routes.html) for routing 
setup. 

Other deployment options is of course possible kubernetes or custom *nix server

## Run with docker

First build the image by running: 
`docker build -t chat:latest .`

Spin it up by running: 
`docker run --name chat -d -p 8000:5000 -e SECRET_KEY=my_very_secret_key --rm chat:latest`


Point your browser at [http://127.0.0.1:8000](http://127.0.0.1:8000)

### Environment variables 
Environment variables can be set either by .env or .flaskenv if you run dev or non docker deployment. 

SECRET_KEY = 'A long random string'
FLASK_APP_BRAND = "Brand name of the app e.g. My data collection chat"
  

# Qualtrics setup
TBD

# Contribute 
Yes please PR's are welcome :sparkling_heart: