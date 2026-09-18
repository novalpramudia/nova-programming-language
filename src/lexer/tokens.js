'use strict';

// Semua jenis token yang dikenali oleh Nova
const TokenType = Object.freeze({
  // Literal
  NUMBER: 'NUMBER',
  STRING: 'STRING',
  IDENTIFIER: 'IDENTIFIER',
  TRUE: 'TRUE',
  FALSE: 'FALSE',

  // Keyword
  LET: 'LET',
  PRINT: 'PRINT',
  IF: 'IF',
  ELSE: 'ELSE',
  WHILE: 'WHILE',
  FOR: 'FOR',
  FUNCTION: 'FUNCTION',
  RETURN: 'RETURN',
  AND: 'AND',
  OR: 'OR',
  NOT: 'NOT',

  // Simbol esoteris (alias Unicode untuk sintaks dasar)
  SYMBOL_LET: 'SYMBOL_LET',
  SYMBOL_PRINT: 'SYMBOL_PRINT',
  SYMBOL_ASSIGN: 'SYMBOL_ASSIGN',
  SYMBOL_IF: 'SYMBOL_IF',
  SYMBOL_ELSE: 'SYMBOL_ELSE',

  // Operator
  PLUS: 'PLUS',
  MINUS: 'MINUS',
  STAR: 'STAR',
  SLASH: 'SLASH',
  PERCENT: 'PERCENT',
  ASSIGN: 'ASSIGN',
  EQ: 'EQ',
  NEQ: 'NEQ',
  GT: 'GT',
  LT: 'LT',
  GTE: 'GTE',
  LTE: 'LTE',

  // Simbol
  LPAREN: 'LPAREN',
  RPAREN: 'RPAREN',
  LBRACE: 'LBRACE',
  RBRACE: 'RBRACE',
  LBRACKET: 'LBRACKET',
  RBRACKET: 'RBRACKET',
  COMMA: 'COMMA',
  SEMICOLON: 'SEMICOLON',

  EOF: 'EOF',
});

// Kata kunci (keyword) reserved dalam bahasa Nova
const KEYWORDS = Object.freeze({
  let: TokenType.LET,
  print: TokenType.PRINT,
  if: TokenType.IF,
  else: TokenType.ELSE,
  while: TokenType.WHILE,
  for: TokenType.FOR,
  function: TokenType.FUNCTION,
  return: TokenType.RETURN,
  true: TokenType.TRUE,
  false: TokenType.FALSE,
  and: TokenType.AND,
  or: TokenType.OR,
  not: TokenType.NOT,
});

class Token {
  constructor(type, value, line, column) {
    this.type = type;
    this.value = value;
    this.line = line;
    this.column = column;
  }

  toString() {
    return `Token(${this.type}, ${JSON.stringify(this.value)}, line=${this.line}, col=${this.column})`;
  }
}

module.exports = { TokenType, KEYWORDS, Token };
