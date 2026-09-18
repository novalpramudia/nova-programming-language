'use strict';

/**
 * Test runner sederhana untuk Nova.
 * Tidak menggunakan framework eksternal (Jest, Mocha, dll) agar
 * project tetap ringan dan mudah dijalankan pemula: `npm test`.
 */

const { Lexer } = require('../src/lexer/lexer');
const { Parser } = require('../src/parser/parser');
const { Interpreter } = require('../src/interpreter/interpreter');

let passed = 0;
let failed = 0;

function runNova(source) {
  const output = [];
  const tokens = new Lexer(source).tokenize();
  const ast = new Parser(tokens).parseProgram();
  const interpreter = new Interpreter({ output: (line) => output.push(line) });
  interpreter.run(ast);
  return output;
}

function test(name, fn) {
  try {
    fn();
    console.log(`  \x1b[32m✓\x1b[0m ${name}`);
    passed++;
  } catch (err) {
    console.log(`  \x1b[31m✗\x1b[0m ${name}`);
    console.log(`      ${err.message}`);
    failed++;
  }
}

function assertEqual(actual, expected, label = '') {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) {
    throw new Error(`${label} Diharapkan ${e}, tetapi mendapat ${a}`);
  }
}

function assertThrows(fn, expectedErrorNamePart) {
  try {
    fn();
  } catch (err) {
    if (expectedErrorNamePart && !err.name.includes(expectedErrorNamePart)) {
      throw new Error(`Diharapkan error '${expectedErrorNamePart}', tetapi mendapat '${err.name}'`);
    }
    return; // sukses: error yang diharapkan muncul
  }
  throw new Error('Diharapkan melempar error, tetapi tidak ada error yang muncul');
}

console.log('\n=== Nova Test Suite (v0.1) ===\n');

console.log('Lexer:');
test('mengenali angka integer dan float', () => {
  const { Lexer } = require('../src/lexer/lexer');
  const tokens = new Lexer('10 3.14').tokenize();
  assertEqual(tokens[0].value.value, 10);
  assertEqual(tokens[1].value.value, 3.14);
});
test('mengenali string dengan escape', () => {
  const tokens = new Lexer('"halo\\ndunia"').tokenize();
  assertEqual(tokens[0].value, 'halo\ndunia');
});
test('melempar error untuk karakter tidak dikenal', () => {
  assertThrows(() => new Lexer('@').tokenize(), 'LexerError');
});
test('melempar error untuk string tidak ditutup', () => {
  assertThrows(() => new Lexer('"halo').tokenize(), 'LexerError');
});

console.log('\nParser:');
test('parsing deklarasi variabel', () => {
  const tokens = new Lexer('let x = 5').tokenize();
  const ast = new Parser(tokens).parseProgram();
  assertEqual(ast.body[0].type, 'VariableDeclaration');
});
test('precedence operator matematika benar (* sebelum +)', () => {
  const tokens = new Lexer('1 + 2 * 3').tokenize();
  const ast = new Parser(tokens).parseProgram();
  const expr = ast.body[0].expression;
  assertEqual(expr.operator, '+');
  assertEqual(expr.right.operator, '*');
});
test('melempar error jika blok tidak ditutup', () => {
  assertThrows(() => {
    const tokens = new Lexer('if x { print(1)').tokenize();
    new Parser(tokens).parseProgram();
  }, 'ParserError');
});

console.log('\nInterpreter — fitur dasar:');
test('print menampilkan string literal', () => {
  assertEqual(runNova('print("Halo dunia!")'), ['Halo dunia!']);
});
test('let mendeklarasikan dan menyimpan variabel', () => {
  assertEqual(runNova('let nama = "Noval"\nprint(nama)'), ['Noval']);
});
test('integer dan float bekerja', () => {
  assertEqual(runNova('let a = 20\nlet b = 3.5\nprint(a)\nprint(b)'), ['20', '3.5']);
});
test('boolean bekerja', () => {
  assertEqual(runNova('let a = true\nlet b = false\nprint(a)\nprint(b)'), ['true', 'false']);
});
test('operator matematika + - * / %', () => {
  assertEqual(runNova('print(2 + 3)'), ['5']);
  assertEqual(runNova('print(10 - 4)'), ['6']);
  assertEqual(runNova('print(3 * 4)'), ['12']);
  assertEqual(runNova('print(10 / 4)'), ['2.5']);
  assertEqual(runNova('print(10 % 3)'), ['1']);
});
test('operator perbandingan == != > < >= <=', () => {
  assertEqual(runNova('print(5 == 5)'), ['true']);
  assertEqual(runNova('print(5 != 4)'), ['true']);
  assertEqual(runNova('print(5 > 4)'), ['true']);
  assertEqual(runNova('print(5 < 4)'), ['false']);
  assertEqual(runNova('print(5 >= 5)'), ['true']);
  assertEqual(runNova('print(5 <= 4)'), ['false']);
});
test('if/else memilih cabang yang benar', () => {
  assertEqual(
    runNova('let umur = 20\nif umur >= 18 {\nprint("Dewasa")\n} else {\nprint("Belum dewasa")\n}'),
    ['Dewasa']
  );
  assertEqual(
    runNova('let umur = 10\nif umur >= 18 {\nprint("Dewasa")\n} else {\nprint("Belum dewasa")\n}'),
    ['Belum dewasa']
  );
});
test('else if berantai bekerja', () => {
  assertEqual(
    runNova('let n = 75\nif n >= 90 {\nprint("A")\n} else if n >= 75 {\nprint("B")\n} else {\nprint("C")\n}'),
    ['B']
  );
});
test('komentar diabaikan', () => {
  assertEqual(runNova('// komentar\nprint(1) // komentar lagi\n/* blok */\nprint(2)'), ['1', '2']);
});
test('penggabungan string dan angka dengan +', () => {
  assertEqual(runNova('let umur = 20\nprint("umur: " + umur)'), ['umur: 20']);
});

console.log('\nInterpreter — error handling:');
test('error saat variabel tidak dideklarasikan', () => {
  assertThrows(() => runNova('print(x)'), 'RuntimeError');
});
test('error saat operasi matematika dengan tipe salah', () => {
  assertThrows(() => runNova('print(1 + true)'), 'RuntimeError');
});
test('error saat pembagian dengan nol', () => {
  assertThrows(() => runNova('print(1 / 0)'), 'RuntimeError');
});

console.log(`\n=== Hasil: ${passed} lulus, ${failed} gagal ===\n`);
process.exit(failed > 0 ? 1 : 0);
