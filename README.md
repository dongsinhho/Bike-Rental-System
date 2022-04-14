git clone https://github.com/dongsinhho/Bike-Rental-System.git
cd BikeRentalSystem
touch .env
vim .env
docker build -t tagName .
docker run -d -p portMachine:portContainer tagName
