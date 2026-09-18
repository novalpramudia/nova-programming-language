#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const { Lexer } = require('../lexer/lexer');
const { Parser } = require('../parser/parser');
const { Interpreter } = require('../interpreter/interpreter');
const { NovaError } = require('../lexer/errors');

const pkg = require('../../package.json');

const HELP_TEXT = `Nova Programming Language v${pkg.version}

Pemakaian:
  nova <file.nova>       Menjalankan file program Nova
  nova --version, -v     Menampilkan versi Nova
  nova --help, -h        Menampilkan bantuan ini

Contoh:
  nova program.nova
  nova examples/hello.nova
`;

function printVersion() {
  console.log(`Nova v${pkg.version}`);
}

function printHelp() {
  console.log(HELP_TEXT);
}

function formatErrorLocation(err) {
  if (err.line !== undefined && err.line !== null) {
    return ` (baris ${err.line}${err.column ? `, kolom ${err.column}` : ''})`;
  }
  return '';
}

function runFile(filePath) {
  const resolved = path.resolve(process.cwd(), filePath);

  if (!fs.existsSync(resolved)) {
    console.error(`Error: File tidak ditemukan: ${filePath}`);
    process.exit(1);
  }

  if (!resolved.endsWith('.nova')) {
    console.error(`Error: File harus berekstensi '.nova' (diterima: ${path.extname(resolved)})`);
    process.exit(1);
  }

  const source = fs.readFileSync(resolved, 'utf-8');

  try {
    const tokens = new Lexer(source).tokenize();
    const ast = new Parser(tokens).parseProgram();
    const interpreter = new Interpreter();
    interpreter.run(ast);
  } catch (err) {
    if (err instanceof NovaError) {
      console.error(`${err.name}: ${err.message}${formatErrorLocation(err)}`);
      console.error(`  di file: ${path.basename(resolved)}`);
      process.exit(1);
    }
    // Error internal / bug pada interpreter itu sendiri
    console.error('Internal Error (bug pada Nova):', err.message);
    process.exit(1);
  }
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    printHelp();
    process.exit(1);
  }

  const first = args[0];

  if (first === '--version' || first === '-v') {
    printVersion();
    return;
  }

  if (first === '--help' || first === '-h') {
    printHelp();
    return;
  }

  runFile(first);
}

main();
