const fs = require('fs');
const readline = require('readline');
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

myEmitter.on('summary', (summary) => {
    console.log(`Soma dos números: ${summary.numberSum}`);
    console.log(`Linhas com texto: ${summary.textLines}`);
    console.log(`Tempo de execução: ${summary.executionTime}ms`);
    askToExecuteAgain();
});

async function processLineByLine(filePath) {
    const start = Date.now();
    let numberSum = 0;
    let textLines = 0;

    try {
        const fileStream = fs.createReadStream(filePath);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        for await (const line of rl) {
            if (/^\d+$/.test(line)) {
                numberSum += parseInt(line, 10);
            } else {
                textLines++;
            }
        }
    } catch (error) {
        console.error(`Erro ao ler o arquivo: ${error.message}`);
        process.exit(1);
    }

    const executionTime = Date.now() - start;
    myEmitter.emit('summary', { numberSum, textLines, executionTime });
}

function askToExecuteAgain() {
    const readlineSync = require('readline-sync');
    const response = readlineSync.keyInYNStrict('Deseja executar novamente?');

    if (response) {
        execute();
    } else {
        console.log('Encerrando a aplicação.');
        process.exit(0);
    }
}

function execute() {
    const readlineSync = require('readline-sync');
    const filePath = readlineSync.question('Digite o caminho do arquivo txt: ');

    processLineByLine(filePath);
}

execute();
