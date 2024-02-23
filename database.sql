-- Hapus database quake-monitor jika sudah ada sebelumnya
DROP DATABASE IF EXISTS quake-monitor;

-- Buat database baru bernama quake-monitor
CREATE DATABASE quake-monitor;

-- Menghapus tabel log jika sudah ada sebelumnya
DROP TABLE IF EXISTS log;

-- Membuat tabel log baru
CREATE TABLE log (
    id VARCHAR(36) PRIMARY KEY,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    content TEXT NOT NULL,
    success BOOLEAN NOT NULL
);