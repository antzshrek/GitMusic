const readline = require('readline');
const process = require('process');

const Player = require('./app/player');
const util = require('./app/utils/util');

const player = new Player(util.getffmpegBinaryPath());
const commands = {
    'l': (...words) => {
        const query = words.join(' ');
        console.log(`Searching: ${query}`);
        player.search(query)
            .then(videos => videos[0].id)
            .then(source => {
                console.log(`Loading: ${query}`);
                player.load(source);
            });
    },
    'p': (...words) => {
        if (words.length === 0) {
            if (player.playing) {
                console.log('Pausing');
                player.pause();
            } else {
                console.log('Playing');
                player.play();
            }
        } else {
            if (!player.playing) player.play();
            commands.l.apply(null, words);
        }
    },
    's': (seconds) => {
        console.log(`Seeking: ${seconds}`);
        player.seek(seconds);
    },
    'q': () => {
        console.log('Exiting');
        process.exit();
    }
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
}).on('line', line => {
    const [command, ...args] = line.split(' ');
    const action = commands[command];
    if (!action) {
        console.error(`Invalid command: ${command}`);
        return;
    }

    action.apply(null, args);
});

if (process.argv.length > 2) {
    commands.p.apply(null, process.argv.slice(2));
}