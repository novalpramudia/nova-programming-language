'use strict';

const { TokenType } = require('../lexer/tokens');
const { ParserError } = require('../lexer/errors');
const AST = require('../ast/ast');

class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.pos = 0;
  }

  // ---------- Utilitas dasar ----------

  peek(offset = 0) {
    return this.tokens[this.pos + offset];
  }

  current() {
    return this.peek();
  }

  isAtEnd() {
    return this.current().type === TokenType.EOF;
  }

  check(type) {
    if (this.isAtEnd() && type !== TokenType.EOF) return false;
    return this.current().type === type;
  }

  advance() {
    if (!this.isAtEnd()) this.pos++;
    return this.tokens[this.pos - 1];
  }

  match(...types) {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  expect(type, message) {
    if (this.check(type)) return this.advance();
    const tok = this.current();
    throw new ParserError(
      `${message} — ditemukan '${tok.value !== null ? tok.value : tok.type}' pada baris ${tok.line}, kolom ${tok.column}`,
      tok.line,
      tok.column
    );
  }

  error(message) {
    const tok = this.current();
    throw new ParserError(`${message} (baris ${tok.line}, kolom ${tok.column})`, tok.line, tok.column);
  }

  // ---------- Entry point ----------

  parseProgram() {
    const body = [];
    while (!this.isAtEnd()) {
      body.push(this.parseStatement());
    }
    return new AST.Program(body);
  }

  // ---------- Statements ----------

  parseStatement() {
    if (this.check(TokenType.LET) || this.check(TokenType.SYMBOL_LET)) {
      return this.parseVariableDeclaration();
    }
    if (this.check(TokenType.PRINT) || this.check(TokenType.SYMBOL_PRINT)) {
      return this.parsePrintStatement();
    }
    if (this.check(TokenType.IF) || this.check(TokenType.SYMBOL_IF)) {
      return this.parseIfStatement();
    }
    if (this.check(TokenType.LBRACE)) return this.parseBlock();
    return this.parseExpressionStatement();
  }

  parseVariableDeclaration() {
    const letTok = this.advance(); // consume 'let'
    const nameTok = this.expect(TokenType.IDENTIFIER, 'Diharapkan nama variabel setelah deklarasi variabel');
    let initializer = null;
    if (this.match(TokenType.ASSIGN, TokenType.SYMBOL_ASSIGN)) {
      initializer = this.parseExpression();
    }
    this.consumeOptionalSemicolon();
    return new AST.VariableDeclaration(nameTok.value, initializer, letTok.line);
  }

  parsePrintStatement() {
    const printTok = this.advance(); // consume 'print'
    this.expect(TokenType.LPAREN, "Diharapkan '(' setelah perintah print");
    let expr = null;
    if (!this.check(TokenType.RPAREN)) {
      expr = this.parseExpression();
    }
    this.expect(TokenType.RPAREN, "Diharapkan ')' untuk menutup 'print(...)'");
    this.consumeOptionalSemicolon();
    return new AST.PrintStatement(expr, printTok.line);
  }

  parseIfStatement() {
    const ifTok = this.advance(); // consume 'if'
    const condition = this.parseExpression();
    const thenBranch = this.parseBlock();
    let elseBranch = null;
    if (this.match(TokenType.ELSE, TokenType.SYMBOL_ELSE)) {
      if (this.check(TokenType.IF) || this.check(TokenType.SYMBOL_IF)) {
        elseBranch = this.parseIfStatement(); // else if
      } else {
        elseBranch = this.parseBlock();
      }
    }
    return new AST.IfStatement(condition, thenBranch, elseBranch, ifTok.line);
  }

  parseBlock() {
    this.expect(TokenType.LBRACE, "Diharapkan '{' untuk memulai blok");
    const body = [];
    while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
      body.push(this.parseStatement());
    }
    this.expect(TokenType.RBRACE, "Diharapkan '}' untuk menutup blok");
    return new AST.BlockStatement(body);
  }

  parseExpressionStatement() {
    const line = this.current().line;
    const expr = this.parseExpression();
    this.consumeOptionalSemicolon();
    return new AST.ExpressionStatement(expr, line);
  }

  // titik koma bersifat opsional di Nova (boleh dipakai, boleh tidak)
  consumeOptionalSemicolon() {
    while (this.match(TokenType.SEMICOLON)) {
      /* konsumsi semua ';' berturut-turut */
    }
  }

  // ---------- Expressions (precedence climbing) ----------
  // assignment -> equality -> comparison -> term -> factor -> unary -> primary

  parseExpression() {
    return this.parseAssignment();
  }

  parseAssignment() {
    const expr = this.parseEquality();

    if (this.check(TokenType.ASSIGN) || this.check(TokenType.SYMBOL_ASSIGN)) {
      const eqTok = this.advance();
      const value = this.parseAssignment();
      if (expr.type === 'Identifier') {
        return new AST.AssignmentExpression(expr.name, value, eqTok.line);
      }
      throw new ParserError(
        `Target penugasan (assignment) tidak valid pada baris ${eqTok.line}`,
        eqTok.line,
        eqTok.column
      );
    }

    return expr;
  }

  parseEquality() {
    let expr = this.parseComparison();
    while (this.check(TokenType.EQ) || this.check(TokenType.NEQ)) {
      const opTok = this.advance();
      const right = this.parseComparison();
      expr = new AST.BinaryExpression(opTok.value, expr, right, opTok.line);
    }
    return expr;
  }

  parseComparison() {
    let expr = this.parseTerm();
    while (
      this.check(TokenType.GT) ||
      this.check(TokenType.LT) ||
      this.check(TokenType.GTE) ||
      this.check(TokenType.LTE)
    ) {
      const opTok = this.advance();
      const right = this.parseTerm();
      expr = new AST.BinaryExpression(opTok.value, expr, right, opTok.line);
    }
    return expr;
  }

  parseTerm() {
    let expr = this.parseFactor();
    while (this.check(TokenType.PLUS) || this.check(TokenType.MINUS)) {
      const opTok = this.advance();
      const right = this.parseFactor();
      expr = new AST.BinaryExpression(opTok.value, expr, right, opTok.line);
    }
    return expr;
  }

  parseFactor() {
    let expr = this.parseUnary();
    while (this.check(TokenType.STAR) || this.check(TokenType.SLASH) || this.check(TokenType.PERCENT)) {
      const opTok = this.advance();
      const right = this.parseUnary();
      expr = new AST.BinaryExpression(opTok.value, expr, right, opTok.line);
    }
    return expr;
  }

  parseUnary() {
    if (this.check(TokenType.MINUS)) {
      const opTok = this.advance();
      const argument = this.parseUnary();
      return new AST.UnaryExpression(opTok.value, argument, opTok.line);
    }
    return this.parseCall();
  }

  parseCall() {
    let expr = this.parsePrimary();
    while (this.check(TokenType.LPAREN)) {
      const parenTok = this.advance();
      const args = [];
      if (!this.check(TokenType.RPAREN)) {
        do {
          args.push(this.parseExpression());
        } while (this.match(TokenType.COMMA));
      }
      this.expect(TokenType.RPAREN, "Diharapkan ')' untuk menutup daftar argumen");
      expr = new AST.CallExpression(expr, args, parenTok.line);
    }
    return expr;
  }

  parsePrimary() {
    const tok = this.current();

    if (this.match(TokenType.NUMBER)) {
      return new AST.Literal(tok.value.value, tok.line);
    }
    if (this.match(TokenType.STRING)) {
      return new AST.Literal(tok.value, tok.line);
    }
    if (this.match(TokenType.TRUE)) {
      return new AST.Literal(true, tok.line);
    }
    if (this.match(TokenType.FALSE)) {
      return new AST.Literal(false, tok.line);
    }
    if (this.match(TokenType.IDENTIFIER)) {
      return new AST.Identifier(tok.value, tok.line);
    }
    if (this.match(TokenType.LPAREN)) {
      const expr = this.parseExpression();
      this.expect(TokenType.RPAREN, "Diharapkan ')' untuk menutup tanda kurung");
      return expr;
    }

    this.error(
      `Ekspresi tidak valid: token tak terduga '${tok.value !== null ? tok.value : tok.type}'`
    );
  }
}

module.exports = { Parser };
