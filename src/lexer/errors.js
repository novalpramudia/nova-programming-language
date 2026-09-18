'use strict';

class NovaError extends Error {
  constructor(message, line, column) {
    super(message);
    this.name = 'NovaError';
    this.line = line;
    this.column = column;
  }
}

class LexerError extends NovaError {
  constructor(message, line, column) {
    super(message, line, column);
    this.name = 'LexerError';
  }
}

class ParserError extends NovaError {
  constructor(message, line, column) {
    super(message, line, column);
    this.name = 'ParserError';
  }
}

class RuntimeErrorNova extends NovaError {
  constructor(message, line, column) {
    super(message, line, column);
    this.name = 'RuntimeError';
  }
}

module.exports = { NovaError, LexerError, ParserError, RuntimeErrorNova };
