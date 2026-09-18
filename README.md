# Nova Programming Language

Nova adalah bahasa pemrograman sederhana yang dibuat dari nol menggunakan Node.js.
File sumber Nova menggunakan ekstensi **`.nova`**.

```
program.nova
      ↓
Nova Lexer        (src/lexer)
      ↓
Nova Parser       (src/parser)
      ↓
AST               (src/ast)
      ↓
Nova Interpreter  (src/interpreter)
      ↓
Terminal Output
```

## Status: v0.1.0

Fitur yang sudah tersedia di versi ini:

- [x] `print(...)`
- [x] Variabel dengan `let`
- [x] Tipe data: String, Integer, Float, Boolean
- [x] Operator matematika: `+ - * / %`
- [x] Operator perbandingan: `== != > < >= <=`
- [x] `if / else` (termasuk `else if` berantai)
- [x] Komentar `// ...` dan `/* ... */`
- [x] Error handling dengan pesan jelas (lexer, parser, runtime) + nomor baris

Fitur yang **belum ada** di v0.1 (rencana untuk versi berikutnya):

- [ ] `while`
- [ ] `for`
- [ ] `function` dan `return`
- [ ] `array`
- [ ] VS Code Extension

## Instalasi

```bash
cd nova
npm install      # tidak ada dependency eksternal, tapi tetap disarankan
npm link         # membuat command `nova` tersedia secara global
```

Setelah `npm link`, Anda bisa memakai Nova dari mana saja:

```bash
nova program.nova
nova --version
nova --help
```

Jika tidak ingin `npm link`, jalankan langsung dengan Node:

```bash
node src/main/cli.js program.nova
```

## Contoh Program

`examples/hello.nova`:
```nova
print("Halo dunia!")
```

`examples/variables.nova`:
```nova
let nama = "Noval"
let umur = 20

print(nama)
print(umur)
```

`examples/condition.nova`:
```nova
let umur = 20

if umur >= 18 {
    print("Dewasa")
} else {
    print("Belum dewasa")
}
```

Jalankan:
```bash
nova examples/hello.nova
nova examples/variables.nova
nova examples/condition.nova
```

## Menjalankan Test

```bash
npm test
```

Test mencakup lexer, parser, dan interpreter (fitur normal + error handling).

## Struktur Project

```
nova/
├── src/
│   ├── lexer/          # Tokenizer: source code -> token
│   │   ├── lexer.js
│   │   ├── tokens.js
│   │   └── errors.js
│   ├── parser/         # Token -> AST (recursive descent parser)
│   │   └── parser.js
│   ├── ast/            # Definisi node-node AST
│   │   └── ast.js
│   ├── interpreter/    # Tree-walking interpreter (mengeksekusi AST)
│   │   └── interpreter.js
│   ├── runtime/        # Environment / scope variabel
│   │   └── environment.js
│   └── main/
│       └── cli.js      # Entry point command `nova`
├── vscode-extension/   # (menyusul di versi berikutnya)
├── examples/           # Contoh program .nova
├── tests/
│   └── run-tests.js
├── package.json
├── README.md
└── LICENSE
```

## Keterbatasan v0.1

- Belum ada looping (`while`, `for`) dan fungsi (`function`) — direncanakan di v0.2.
- Belum ada tipe data `array`.
- Pesan error sudah mencakup baris & kolom, tetapi belum menunjukkan potongan source code (seperti compiler modern semacam Rust). Ini bisa ditambahkan nanti sebagai peningkatan kualitas pesan error.
- Interpreter bersifat tree-walking (menjelajahi AST langsung), bukan bytecode/VM — pilihan ini disengaja demi kesederhanaan dan kemudahan dipahami pemula, dengan konsekuensi performa lebih lambat dibanding bahasa production seperti Python/JS asli. Untuk skala project belajar/personal, ini bukan masalah.
