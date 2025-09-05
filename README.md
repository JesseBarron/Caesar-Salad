# Caesar Salad

A TypeScript CLI tool for Caesar cipher encryption/decryption with customizable shift values.

## Installation

```bash
npm install -g caesar-salad
```

## Usage

### Command Line Interface

```bash
# Encrypt text with default shift (1)
caesar-salad "hello world"

# Encrypt with custom shift
caesar-salad "hello world" -n 5

# Decrypt text
caesar-salad "ifmmp xpsme" -d

# Read from file
caesar-salad -f input.txt -o output.txt

# Generate DOCX output
caesar-salad "hello world" -o output.docx --docx
```

### Programmatic Usage

```typescript
import { caesarCipher } from 'caesar-salad';

// Encrypt with default shift (1)
const encrypted = caesarCipher("hello world");

// Encrypt with custom shift
const encrypted = caesarCipher("hello world", { steps: 5 });

// Decrypt
const decrypted = caesarCipher("ifmmp xpsme", { decrypt: true });
```

## Options

- `-n, --steps <number>`: Number of steps characters should be shifted (default: 1)
- `-f, --file <path>`: Read input from file instead of using string buffer
- `-o, --output <path>`: Optional path to output file
- `-d, --decrypt`: Decrypt the input instead of encrypting it
- `--docx`: Generate output as DOCX file (requires -o option)

## Requirements

- Node.js >= 16.0.0

## License

ISC