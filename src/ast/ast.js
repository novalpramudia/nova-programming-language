'use strict';

// Setiap node AST adalah class sederhana (plain data holder).
// 'type' dipakai oleh interpreter untuk menentukan cara mengeksekusinya.

class Program {
  constructor(body) {
    this.type = 'Program';
    this.body = body; // array of Statement
  }
}

// ---------- Statements ----------

class VariableDeclaration {
  constructor(name, initializer, line) {
    this.type = 'VariableDeclaration';
    this.name = name;
    this.initializer = initializer;
    this.line = line;
  }
}

class PrintStatement {
  constructor(expression, line) {
    this.type = 'PrintStatement';
    this.expression = expression;
    this.line = line;
  }
}

class ExpressionStatement {
  constructor(expression, line) {
    this.type = 'ExpressionStatement';
    this.expression = expression;
    this.line = line;
  }
}

class BlockStatement {
  constructor(body) {
    this.type = 'BlockStatement';
    this.body = body;
  }
}

class IfStatement {
  constructor(condition, thenBranch, elseBranch, line) {
    this.type = 'IfStatement';
    this.condition = condition;
    this.thenBranch = thenBranch;
    this.elseBranch = elseBranch; // bisa null, BlockStatement, atau IfStatement (else if)
    this.line = line;
  }
}

class WhileStatement {
  constructor(condition, body, line) {
    this.type = 'WhileStatement';
    this.condition = condition;
    this.body = body;
    this.line = line;
  }
}

class ForStatement {
  constructor(init, condition, update, body, line) {
    this.type = 'ForStatement';
    this.init = init;
    this.condition = condition;
    this.update = update;
    this.body = body;
    this.line = line;
  }
}

class FunctionDeclaration {
  constructor(name, params, body, line) {
    this.type = 'FunctionDeclaration';
    this.name = name;
    this.params = params;
    this.body = body;
    this.line = line;
  }
}

class ReturnStatement {
  constructor(argument, line) {
    this.type = 'ReturnStatement';
    this.argument = argument;
    this.line = line;
  }
}

// ---------- Expressions ----------

class BinaryExpression {
  constructor(operator, left, right, line) {
    this.type = 'BinaryExpression';
    this.operator = operator;
    this.left = left;
    this.right = right;
    this.line = line;
  }
}

class LogicalExpression {
  constructor(operator, left, right, line) {
    this.type = 'LogicalExpression';
    this.operator = operator;
    this.left = left;
    this.right = right;
    this.line = line;
  }
}

class UnaryExpression {
  constructor(operator, argument, line) {
    this.type = 'UnaryExpression';
    this.operator = operator;
    this.argument = argument;
    this.line = line;
  }
}

class AssignmentExpression {
  constructor(name, value, line) {
    this.type = 'AssignmentExpression';
    this.name = name;
    this.value = value;
    this.line = line;
  }
}

class CallExpression {
  constructor(callee, args, line) {
    this.type = 'CallExpression';
    this.callee = callee;
    this.arguments = args;
    this.line = line;
  }
}

class ArrayExpression {
  constructor(elements, line) {
    this.type = 'ArrayExpression';
    this.elements = elements;
    this.line = line;
  }
}

class IndexExpression {
  constructor(object, index, line) {
    this.type = 'IndexExpression';
    this.object = object;
    this.index = index;
    this.line = line;
  }
}

class Identifier {
  constructor(name, line) {
    this.type = 'Identifier';
    this.name = name;
    this.line = line;
  }
}

class Literal {
  constructor(value, line) {
    this.type = 'Literal';
    this.value = value;
    this.line = line;
  }
}

module.exports = {
  Program,
  VariableDeclaration,
  PrintStatement,
  ExpressionStatement,
  BlockStatement,
  IfStatement,
  WhileStatement,
  ForStatement,
  FunctionDeclaration,
  ReturnStatement,
  BinaryExpression,
  LogicalExpression,
  UnaryExpression,
  AssignmentExpression,
  CallExpression,
  ArrayExpression,
  IndexExpression,
  Identifier,
  Literal,
};
