'use strict';

const { TokenType, KEYWORDS, Token } = require('./tokens');
const { LexerError } = require('./errors');

const isDigit = (ch) => ch >= '0' && ch <= '9';
const isAlpha = (ch) => /[a-zA-Z_]/.test(ch);
const isAlphaNumeric = (ch) => isAlpha(ch) || isDigit(ch);

class Lexer {
  constructor(source) {
    this.source = source;
    this.pos = 0;
    this.line = 1;
    this.column = 1;
    this.tokens = [];
  }

  error(message) {
    throw new LexerError(message, this.line, this.column);
  }

  peek(offset = 0) {
    const idx = this.pos + offset;
    return idx < this.source.length ? this.source[idx] : '\0';
  }

  advance() {
    const ch = this.source[this.pos];
    this.pos++;
    if (ch === '\n') {
      this.line++;
      this.column = 1;
    } else {
      this.column++;
    }
    return ch;
  }

  match(expected) {
    if (this.peek() === expected) {
      this.advance();
      return true;
    }
    return false;
  }

  addToken(type, value, line, column) {
    this.tokens.push(new Token(type, value, line, column));
  }

  skipWhitespaceAndComments() {
    while (true) {
      const ch = this.peek();
      if (ch === ' ' || ch === '\t' || ch === '\r' || ch === '\n') {
        this.advance();
      } else if (ch === '/' && this.peek(1) === '/') {
        // Komentar satu baris: // ...
        while (this.peek() !== '\n' && this.peek() !== '\0') this.advance();
      } else if (ch === '/' && this.peek(1) === '*') {
        // Komentar multi-baris: /* ... */
        const startLine = this.line;
        const startCol = this.column;
        this.advance();
        this.advance();
        let closed = false;
        while (this.peek() !== '\0') {
          if (this.peek() === '*' && this.peek(1) === '/') {
            this.advance();
            this.advance();
            closed = true;
            break;
          }
          this.advance();
        }
        if (!closed) {
          throw new LexerError('Komentar /* ... */ tidak ditutup', startLine, startCol);
        }
      } else {
        break;
      }
    }
  }

  readString(quote, startLine, startCol) {
    let value = '';
    while (this.peek() !== quote) {
      if (this.peek() === '\0' || this.peek() === '\n') {
        throw new LexerError('String tidak ditutup dengan tanda kutip', startLine, startCol);
      }
      if (this.peek() === '\\') {
        this.advance();
        const esc = this.advance();
        switch (esc) {
          case 'n': value += '\n'; break;
          case 't': value += '\t'; break;
          case 'r': value += '\r'; break;
          case '"': value += '"'; break;
          case "'": value += "'"; break;
          case '\\': value += '\\'; break;
          default:
            throw new LexerError(`Escape sequence tidak dikenal: \\${esc}`, this.line, this.column);
        }
      } else {
        value += this.advance();
      }
    }
    this.advance(); // konsumsi kutip penutup
    return value;
  }

  readNumber() {
    let numStr = '';
    while (isDigit(this.peek())) numStr += this.advance();

    let isFloat = false;
    if (this.peek() === '.' && isDigit(this.peek(1))) {
      isFloat = true;
      numStr += this.advance(); // '.'
      while (isDigit(this.peek())) numStr += this.advance();
    }

    return { value: isFloat ? parseFloat(numStr) : parseInt(numStr, 10), isFloat };
  }

  readIdentifier() {
    let idStr = '';
    while (isAlphaNumeric(this.peek())) idStr += this.advance();
    return idStr;
  }

  tokenize() {
    while (true) {
      this.skipWhitespaceAndComments();
      if (this.peek() === '\0') break;

      const startLine = this.line;
      const startCol = this.column;
      const ch = this.peek();

      const symbolicTokens = {
        '⟁': TokenType.SYMBOL_LET,
        '⎋': TokenType.SYMBOL_PRINT,
        '⤍': TokenType.SYMBOL_ASSIGN,
        '⯈': TokenType.SYMBOL_IF,
        '⯇': TokenType.SYMBOL_ELSE,
      };
      if (symbolicTokens[ch]) {
        this.advance();
        this.addToken(symbolicTokens[ch], ch, startLine, startCol);
        continue;
      }

      if (isDigit(ch)) {
        const { value, isFloat } = this.readNumber();
        this.addToken(TokenType.NUMBER, { value, isFloat }, startLine, startCol);
        continue;
      }

      if (isAlpha(ch)) {
        const id = this.readIdentifier();
        const keywordType = KEYWORDS[id];
        if (keywordType === TokenType.TRUE) {
          this.addToken(TokenType.TRUE, true, startLine, startCol);
        } else if (keywordType === TokenType.FALSE) {
          this.addToken(TokenType.FALSE, false, startLine, startCol);
        } else if (keywordType) {
          this.addToken(keywordType, id, startLine, startCol);
        } else {
          this.addToken(TokenType.IDENTIFIER, id, startLine, startCol);
        }
        continue;
      }

      if (ch === '"' || ch === "'") {
        this.advance(); // konsumsi kutip pembuka
        const str = this.readString(ch, startLine, startCol);
        this.addToken(TokenType.STRING, str, startLine, startCol);
        continue;
      }

      this.advance(); // konsumsi karakter simbol/operator

      switch (ch) {
        case '+': this.addToken(TokenType.PLUS, '+', startLine, startCol); break;
        case '-': this.addToken(TokenType.MINUS, '-', startLine, startCol); break;
        case '*': this.addToken(TokenType.STAR, '*', startLine, startCol); break;
        case '/': this.addToken(TokenType.SLASH, '/', startLine, startCol); break;
        case '%': this.addToken(TokenType.PERCENT, '%', startLine, startCol); break;
        case '(': this.addToken(TokenType.LPAREN, '(', startLine, startCol); break;
        case ')': this.addToken(TokenType.RPAREN, ')', startLine, startCol); break;
        case '{': this.addToken(TokenType.LBRACE, '{', startLine, startCol); break;
        case '}': this.addToken(TokenType.RBRACE, '}', startLine, startCol); break;
        case '[': this.addToken(TokenType.LBRACKET, '[', startLine, startCol); break;
        case ']': this.addToken(TokenType.RBRACKET, ']', startLine, startCol); break;
        case ',': this.addToken(TokenType.COMMA, ',', startLine, startCol); break;
        case ';': this.addToken(TokenType.SEMICOLON, ';', startLine, startCol); break;
        case '=':
          if (this.match('=')) this.addToken(TokenType.EQ, '==', startLine, startCol);
          else this.addToken(TokenType.ASSIGN, '=', startLine, startCol);
          break;
        case '!':
          if (this.match('=')) this.addToken(TokenType.NEQ, '!=', startLine, startCol);
          else throw new LexerError(`Karakter tidak dikenal: '!'`, startLine, startCol);
          break;
        case '>':
          if (this.match('=')) this.addToken(TokenType.GTE, '>=', startLine, startCol);
          else this.addToken(TokenType.GT, '>', startLine, startCol);
          break;
        case '<':
          if (this.match('=')) this.addToken(TokenType.LTE, '<=', startLine, startCol);
          else this.addToken(TokenType.LT, '<', startLine, startCol);
          break;
        default:
          throw new LexerError(`Karakter tidak dikenal: '${ch}'`, startLine, startCol);
      }
    }

    this.addToken(TokenType.EOF, null, this.line, this.column);
    return this.tokens;
  }
}

module.exports = { Lexer };
