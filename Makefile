.PHONY: dev test deploy

dev:
	docker-compose -f infra/docker-compose.yml up --build

test:
	pytest backend/tests/

deploy:
	# Deploy to production