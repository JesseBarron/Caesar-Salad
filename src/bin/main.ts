#!/usr/bin/env node

import { Command } from "commander";
import { encrypt, decrypt } from "text-encrypter";
import * as fs from "fs";
import { Document, Paragraph, TextRun, Packer } from "docx";

const program = new Command();

interface CommandOptions {
  steps: string;
  file?: string;
  output?: string;
  decrypt?: boolean;
  docx?: boolean;
}

async function createDocxFile(text: string, outputPath: string): Promise<void> {
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
  .action(async (input: string | undefined, options: CommandOptions) => {
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

    let inputText: string;

    // Check if file option is provided
    if (options.file) {
      try {
        inputText = fs.readFileSync(options.file, "utf8");
      } catch (error) {
        console.error(`Error reading file ${options.file}: ${(error as Error).message}`);
        process.exit(1);
      }
    } else {
      // Treat input as string buffer
      inputText = input!;
    }

    // Process the text using Caesar cipher (encrypt or decrypt)
    let processedText: string;
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
          `Error writing to file ${options.output}: ${(error as Error).message}`,
        );
        process.exit(1);
      }
    } else {
      console.log(processedText);
    }
  });

program.parse();