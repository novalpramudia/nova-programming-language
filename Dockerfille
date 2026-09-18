# Gunakan Node.js LTS berbasis Alpine agar image ringan
FROM node:20-alpine

# Tentukan direktori kerja di dalam container
WORKDIR /app

# Salin file konfigurasi dependency
COPY package*.json ./

# Install dependency
RUN npm install

# Salin seluruh kode sumber proyek
COPY . .

# Link CLI nova agar command `nova` tersedia secara global di container
RUN npm link

# Default command saat container dijalankan
CMD ["nova", "examples/hello.nova"]
