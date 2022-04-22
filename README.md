# Bike Rental API with NodeJS

## Requirements
- Install Docker, Git ... or Node, npm
- Docker Hub account

## Development

```
$ git clone https://github.com/dongsinhho/Bike-Rental-System.git
$ cd BikeRentalSystem
$ touch .env
$ vim .env
$ docker build -t tagName .
$ docker run -d -p portMachine:portContainer tagName
```

#### Environment variable
```
PORT=3000
DB_USER=
DB_PASSWORD=
MONGODB_URL=
JWT_SECRET_KEY=t
EXPIRES_IN=2d
STATION_EXPIRES_IN=100d
STATION_PORT=3456
```

- [x] Dockerize
- [ ] Push Image to Docker Hub
- [ ] Create Kubernetes Deployment.yml
- [ ] Deploy API in kubernetes
