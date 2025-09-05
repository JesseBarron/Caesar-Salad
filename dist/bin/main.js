#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const text_encrypter_1 = require("text-encrypter");
const fs = __importStar(require("fs"));
const docx_1 = require("docx");
const program = new commander_1.Command();
async function createDocxFile(text, outputPath) {
    const doc = new docx_1.Document({
        sections: [
            {
                properties: {},
                children: [
                    new docx_1.Paragraph({
                        children: [new docx_1.TextRun(text)],
                    }),
                ],
            },
        ],
    });
    const buffer = await docx_1.Packer.toBuffer(doc);
    fs.writeFileSync(outputPath, buffer);
}
program
    .name("caesar-salad")
    .description("CLI tool for Caesar cipher encryption/decryption with customizable shift")
    .version("1.0.0");
program
    .argument("[input]", "Input string buffer (required unless -f is provided)")
    .option("-n, --steps <number>", "Number of steps characters should be shifted", "1")
    .option("-f, --file <path>", "Read input from file instead of using string buffer")
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
        console.error("Error: Either provide input text or use -f to specify a file");
        process.exit(1);
    }
    // Validate docx option requires output file
    if (options.docx && !options.output) {
        console.error("Error: --docx option requires -o/--output to specify output file path");
        process.exit(1);
    }
    let inputText;
    // Check if file option is provided
    if (options.file) {
        try {
            inputText = fs.readFileSync(options.file, "utf8");
        }
        catch (error) {
            console.error(`Error reading file ${options.file}: ${error.message}`);
            process.exit(1);
        }
    }
    else {
        // Treat input as string buffer
        inputText = input;
    }
    // Process the text using Caesar cipher (encrypt or decrypt)
    let processedText;
    if (options.decrypt) {
        processedText = (0, text_encrypter_1.decrypt)(inputText, steps, true);
    }
    else {
        processedText = (0, text_encrypter_1.encrypt)(inputText, steps, true);
    }
    // Output handling
    if (options.output) {
        try {
            if (options.docx) {
                await createDocxFile(processedText, options.output);
            }
            else {
                fs.writeFileSync(options.output, processedText);
            }
            const operation = options.decrypt ? "Decrypted" : "Encrypted";
            const format = options.docx ? "DOCX" : "text";
            console.log(`${operation} ${format} written to ${options.output}`);
        }
        catch (error) {
            console.error(`Error writing to file ${options.output}: ${error.message}`);
            process.exit(1);
        }
    }
    else {
        console.log(processedText);
    }
});
program.parse();
//# sourceMappingURL=main.js.map