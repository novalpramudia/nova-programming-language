'use strict';

const { RuntimeErrorNova } = require('../lexer/errors');

class Environment {
  constructor(parent = null) {
    this.parent = parent;
    this.values = new Map();
  }

  define(name, value) {
    this.values.set(name, value);
  }

  get(name, line) {
    if (this.values.has(name)) return this.values.get(name);
    if (this.parent) return this.parent.get(name, line);
    throw new RuntimeErrorNova(`Variabel '${name}' tidak dikenal (belum dideklarasikan dengan 'let')`, line);
  }

  assign(name, value, line) {
    if (this.values.has(name)) {
      this.values.set(name, value);
      return;
    }
    if (this.parent) {
      this.parent.assign(name, value, line);
      return;
    }
    throw new RuntimeErrorNova(`Tidak bisa memberi nilai ke variabel '${name}' yang belum dideklarasikan`, line);
  }
}

module.exports = { Environment };
