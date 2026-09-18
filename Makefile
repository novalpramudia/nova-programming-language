.PHONY: install test link run-hello run-vars run-cond docker-build docker-run clean

# Instalasi dependency
install:
	npm install

# Menjalankan pengujian (tests)
test:
	npm test

# Menghubungkan CLI Nova secara global
link:
	npm link

# Shortcut menjalankan contoh program Nova
run-hello:
	nova examples/hello.nova

run-vars:
	nova examples/variables.nova

run-cond:
	nova examples/condition.nova

# Perintah Docker
docker-build:
	docker build -t nova-lang .

docker-run:
	docker run --rm nova-lang

# Membersihkan node_modules jika diperlukan
clean:
	rm -rf node_modules
