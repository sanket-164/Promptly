BACKEND_IMAGE = sanket164/promptly:backend
DB_IMAGE = mysql:latest

up:
	@cd ./backend && docker-compose up 


pull:
	@docker pull $(BACKEND_IMAGE) --platform linux/amd64
	@docker pull $(DB_IMAGE) --platform linux/amd64