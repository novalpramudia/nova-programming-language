'use strict';

const { Environment } = require('../runtime/environment');
const { RuntimeErrorNova } = require('../lexer/errors');

function stringify(value) {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return String(value);
  if (Array.isArray(value)) return '[' + value.map(stringify).join(', ') + ']';
  return String(value);
}

function isTruthy(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'string') return value.length > 0;
  return true;
}

class Interpreter {
  constructor({ output = (line) => console.log(line) } = {}) {
    this.globals = new Environment();
    this.output = output;
  }

  run(program) {
    this.executeBlock(program.body, this.globals);
  }

  executeBlock(statements, env) {
    for (const stmt of statements) {
      this.execute(stmt, env);
    }
  }

  execute(node, env) {
    switch (node.type) {
      case 'VariableDeclaration':
        return this.execVariableDeclaration(node, env);
      case 'PrintStatement':
        return this.execPrintStatement(node, env);
      case 'ExpressionStatement':
        return this.evaluate(node.expression, env);
      case 'BlockStatement':
        return this.executeBlock(node.body, new Environment(env));
      case 'IfStatement':
        return this.execIfStatement(node, env);
      default:
        throw new RuntimeErrorNova(`Statement tidak dikenal: ${node.type}`, node.line);
    }
  }

  execVariableDeclaration(node, env) {
    const value = node.initializer !== null ? this.evaluate(node.initializer, env) : null;
    env.define(node.name, value);
  }

  execPrintStatement(node, env) {
    const value = node.expression !== null ? this.evaluate(node.expression, env) : '';
    this.output(stringify(value));
  }

  execIfStatement(node, env) {
    if (isTruthy(this.evaluate(node.condition, env))) {
      this.execute(node.thenBranch, env);
    } else if (node.elseBranch !== null) {
      this.execute(node.elseBranch, env);
    }
  }

  evaluate(node, env) {
    switch (node.type) {
      case 'Literal':
        return node.value;
      case 'Identifier':
        return env.get(node.name, node.line);
      case 'AssignmentExpression': {
        const value = this.evaluate(node.value, env);
        env.assign(node.name, value, node.line);
        return value;
      }
      case 'UnaryExpression':
        return this.evalUnary(node, env);
      case 'BinaryExpression':
        return this.evalBinary(node, env);
      case 'CallExpression':
        throw new RuntimeErrorNova(
          `Pemanggilan fungsi belum didukung di versi ini`,
          node.line
        );
      default:
        throw new RuntimeErrorNova(`Ekspresi tidak dikenal: ${node.type}`, node.line);
    }
  }

  evalUnary(node, env) {
    const value = this.evaluate(node.argument, env);
    if (node.operator === '-') {
      this.assertNumber(value, node.line, 'Operator unary minus (-)');
      return -value;
    }
    throw new RuntimeErrorNova(`Operator unary tidak dikenal: ${node.operator}`, node.line);
  }

  evalBinary(node, env) {
    const left = this.evaluate(node.left, env);
    const right = this.evaluate(node.right, env);
    const op = node.operator;
    const line = node.line;

    switch (op) {
      case '+':
        if (typeof left === 'string' || typeof right === 'string') {
          return stringify(left) + stringify(right);
        }
        this.assertNumber(left, line, "Operator '+'");
        this.assertNumber(right, line, "Operator '+'");
        return left + right;
      case '-':
        this.assertNumber(left, line, "Operator '-'");
        this.assertNumber(right, line, "Operator '-'");
        return left - right;
      case '*':
        this.assertNumber(left, line, "Operator '*'");
        this.assertNumber(right, line, "Operator '*'");
        return left * right;
      case '/':
        this.assertNumber(left, line, "Operator '/'");
        this.assertNumber(right, line, "Operator '/'");
        if (right === 0) {
          throw new RuntimeErrorNova('Pembagian dengan nol (division by zero)', line);
        }
        return left / right;
      case '%':
        this.assertNumber(left, line, "Operator '%'");
        this.assertNumber(right, line, "Operator '%'");
        if (right === 0) {
          throw new RuntimeErrorNova('Operasi modulo dengan nol (division by zero)', line);
        }
        return left % right;
      case '==':
        return left === right;
      case '!=':
        return left !== right;
      case '>':
        this.assertNumber(left, line, "Operator '>'");
        this.assertNumber(right, line, "Operator '>'");
        return left > right;
      case '<':
        this.assertNumber(left, line, "Operator '<'");
        this.assertNumber(right, line, "Operator '<'");
        return left < right;
      case '>=':
        this.assertNumber(left, line, "Operator '>='");
        this.assertNumber(right, line, "Operator '>='");
        return left >= right;
      case '<=':
        this.assertNumber(left, line, "Operator '<='");
        this.assertNumber(right, line, "Operator '<='");
        return left <= right;
      default:
        throw new RuntimeErrorNova(`Operator biner tidak dikenal: ${op}`, line);
    }
  }

  assertNumber(value, line, context) {
    if (typeof value !== 'number') {
      throw new RuntimeErrorNova(
        `${context} membutuhkan tipe angka (number), tetapi menerima '${stringify(value)}'`,
        line
      );
    }
  }
}

module.exports = { Interpreter, stringify, isTruthy };
