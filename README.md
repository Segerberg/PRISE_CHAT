# PRISE CHAT
A support chat application for integration with qualtrics through embedding `<iframe>`
Used to communicate with research participants during live lab data collections in the PRISE research project

[https://www.gu.se/forskning/prise](https://www.gu.se/forskning/prise)

### Code
Prise chat uses a python flask backend with socket.io for message transport. The docker container fires up a gunicorn 
server with eventlet for socket support. 


# Deployment
PRISE CHAT is deployed for production in University of Gothenburgs
[openshift](https://www.redhat.com/en/technologies/cloud-computing/openshift) 
platform. Secure communication setting like TSL and CORS are configured with openshift routing. Please see 
[openshift docs](https://docs.openshift.com/container-platform/4.1/networking/routes/secured-routes.html) for routing 
setup. 

Other deployment options is of course possible kubernetes or custom *nix server

## Run with docker
`docker build -t chat:latest .`

`docker run --name chat -d -p 8000:5000 -e SECRET_KEY=my_very_secret_key --rm chat:latest`


Point your browser at [http://127.0.0.1:8000](http://127.0.0.1:8000)

### Environment variables 
TBD

# Qualtrics setup
TBD

