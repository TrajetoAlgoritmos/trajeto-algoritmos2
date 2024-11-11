#reset and remove all docker containers
reset:
	docker system prune -f ; docker volume prune -f
build:
	docker-compose up --build

# all
all: reset build