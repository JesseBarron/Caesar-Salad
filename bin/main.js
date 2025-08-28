#!/usr/bin/env node

const { Command } = require("commander");
const { encrypt, decrypt } = require("text-encrypter");
const fs = require("fs");
const { Document, Paragraph, TextRun, Packer } = require("docx");

const program = new Command();

async function createDocxFile(text, outputPath) {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [new TextRun(text)],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
}

program
  .name("caesar-salad")
  .description(
    "CLI tool for Caesar cipher encryption/decryption with customizable shift",
  )
  .version("1.0.0");

program
  .argument("[input]", "Input string buffer (required unless -f is provided)")
  .option(
    "-n, --steps <number>",
    "Number of steps characters should be shifted",
    "1",
  )
  .option(
    "-f, --file <path>",
    "Read input from file instead of using string buffer",
  )
  .option("-o, --output <path>", "Optional path to output file")
  .option("-d, --decrypt", "Decrypt the input instead of encrypting it")
  .option("--docx", "Generate output as DOCX file (requires -o option)")
  .action(async (input, options) => {
    const steps = parseInt(options.steps, 10);

    if (isNaN(steps)) {
      console.error("Error: Steps must be a valid number");
      process.exit(1);
    }

    // Validate that either input or file option is provided
    if (!input && !options.file) {
      console.error(
        "Error: Either provide input text or use -f to specify a file",
      );
      process.exit(1);
    }

    // Validate docx option requires output file
    if (options.docx && !options.output) {
      console.error(
        "Error: --docx option requires -o/--output to specify output file path",
      );
      process.exit(1);
    }

    let inputText;

    // Check if file option is provided
    if (options.file) {
      try {
        inputText = fs.readFileSync(options.file, "utf8");
      } catch (error) {
        console.error(`Error reading file ${options.file}: ${error.message}`);
        process.exit(1);
      }
    } else {
      // Treat input as string buffer
      inputText = input;
    }

    // Process the text using Caesar cipher (encrypt or decrypt)
    let processedText;
    if (options.decrypt) {
      processedText = decrypt(inputText, steps, true);
    } else {
      processedText = encrypt(inputText, steps, true);
    }

    // Output handling
    if (options.output) {
      try {
        if (options.docx) {
          await createDocxFile(processedText, options.output);
        } else {
          fs.writeFileSync(options.output, processedText);
        }
        const operation = options.decrypt ? "Decrypted" : "Encrypted";
        const format = options.docx ? "DOCX" : "text";
        console.log(`${operation} ${format} written to ${options.output}`);
      } catch (error) {
        console.error(
          `Error writing to file ${options.output}: ${error.message}`,
        );
        process.exit(1);
      }
    } else {
      console.log(processedText);
    }
  });

program.parse();
