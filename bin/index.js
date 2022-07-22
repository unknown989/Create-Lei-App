#!/usr/bin/env node

const { Spinnr, patterns } = require("spinnr");
const kleur = require("kleur");
const process = require("process");
const { exec, spawn } = require("child_process");
const { exit } = require("process");
const path = require("path");


const VERSION = 1.0;

const spinner = new Spinnr();
const readline = require("readline").createInterface({ input: process.stdin, output: process.stdout });

const checking_software = async () => {
    const git = spawn("git", ["--version"]);


    git.stderr.on("data", data => {
        console.log("An error occured while checking software");
        console.error(kleur.red().bold(data));
        exit(1)
    });

    git.on('error', (error) => {
        if (error.message.includes("ENOENT")) {
            console.log(kleur.red().bold("GIT is not installed, exiting..."));
            exit(1)
        }
    });
}
const run_cmd = async (cmd, args) => {
    const git = spawn(cmd, args);
    git.stderr.on("data", data => {
        console.error(kleur.red().bold(data));
        exit(1);
    });

    git.on('error', (error) => {
        console.log(kleur.red().bold(error.message + " ,exiting..."));
        exit(1);
    });

}


checking_software().then(() => {

    const templates = { "lei": "https://github.com/unknown989/lei" }

    spinner.set_pattern(patterns.Bars);
    spinner.set_interval(75);
    spinner.set_text_edit(kleur.green().bold);
    spinner.set_loading_edit(kleur.green)

    spinner.set_done_flag("✔");


    readline.question(kleur.bold("What's the project name? "), name => {
        if (!name) {
            console.error(kleur.red("You didn't specify a project name")); exit(1);
        }
        const template = "lei"; // When more examples are available ask for a template
        const cmd = `git clone ${templates[template]} ${name}`;

        spinner.set_text("Downloading template...");
        spinner.start();

        exec(cmd, (err, _, serr) => {
            if (err) {
                console.error(kleur.red().bold(err.message));
                spinner.stop();
                spinner.
                    return;
            }
            spinner.set_text("Happy adventure dear brogrammer!")
            spinner.stop();
            console.log(kleur.blue("\ncd " + path.join(__dirname, name)));
        })

        readline.close();
    })
})
