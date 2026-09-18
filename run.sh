#!/usr/bin/env bash

# Hentikan eksekusi jika terjadi kesalahan
set -e

# Warna untuk output terminal
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}==> Memeriksa Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js belum terinstal. Silakan instal Node.js terlebih dahulu.${NC}"
    exit 1
fi

# Tentukan file yang akan dijalankan (default: examples/hello.nova)
TARGET_FILE="${1:-examples/hello.nova}"

if [ ! -f "$TARGET_FILE" ]; then
    echo -e "${RED}Error: File '$TARGET_FILE' tidak ditemukan.${NC}"
    exit 1
fi

echo -e "${GREEN}==> Menjalankan $TARGET_FILE menggunakan Nova CLI...${NC}"
node src/main/cli.js "$TARGET_FILE"
