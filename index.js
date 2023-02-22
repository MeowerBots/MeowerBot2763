import Bot from "meowerbot";
import fetch from "node-fetch";
import { exec } from "child_process";
import * as dotenv from "dotenv";
import JSONdb from "simple-json-db";

import { log } from "./lib/logs.js";
import Wordle from "./lib/wordle.js";
import { toRelative } from "./lib/relative.js";

dotenv.config();
const prefix = "#"
const username = process.env["MDW125_USERNAME"];
const password = process.env["MDW125_PASSWORD"];
const uptime = new Date().getTime();
let temp = ["help", "uptime", "uwu", "8ball", "zen", "shorten", "cat", "status", "credits", "karma", "mute", "unmute", "wordle", "poll", "random", "whois", "repeat", "balance", "work", "leaderboard"];
const help = temp.map(i => prefix + i);
const admins = ["WlodekM", "WlodekM2", "WlodekM3", "WlodekM4", "WlodekM5", "wlbot"];
const db = new JSONdb("./db.json");
const money = new JSONdb("./money.json");
const bot = new Bot(username, password);
const wordle = new Wordle();


if (!(db.has("MDW125-POLLS"))) {
  db.set("MDW125-POLLS", []);
}
/*
@MeowerBot2763
A bot for meower
All OLD code was writen for MDBot
New code written by Fir(WlodekM)
©WlodekM Co. 2023-2026
*/
    function mathRandomInt(a, b) {
        if (a > b) {
            // Swap a and b to ensure a is smaller.
            var c = a;
            a = b;
            b = c;
        }
        return Math.floor(Math.random() * (b - a + 1) + a);
    }
function gettime() {
return Math.floor(Date.now() / 1000)
}
bot.onPost(async (user, message, origin) => {
  /*============ OLD CODE ============*/
  if (message.startsWith(prefix) && db.has(`MDW125-MUTED-${user}`)) {
    if (db.get(`MDW125-MUTED-${user}`)) {
      bot.post(`You are currently muted from ${username}.
Reason: "${db.get(`MDW125-MUTED-${user}`)}"`, origin);
      log(`${user} tried to use the command "${message}", but they are muted from ${username} for "${db.get(`MDW125-MUTED-${user}`)}"`);
    } else {
      bot.post(`You are currently muted from ${username}.`, origin);
      log(`${user} tried to use the command "${message}", but they are muted from ${username}`);
    }
    return;
  }

  if (message.startsWith(prefix) && !(help.includes(message.split(" ")[0]))) {
    if (message.startsWith(prefix + "! ")) {
      return;
    }
    bot.post("That command doesn't exist! Use " + prefix + "help to see a list of commands.", origin);
    log(`${user} tried to use a command that does not exist. The command was "${message}"`);
    return;
  }

  if (message.startsWith(prefix + "help")) {
    if (message.split(" ")[1] === undefined) {
      bot.post(`Commands:
    ${help.join(", ")}`, origin);
    } else {
      if (message.split(" ")[1] === "help") {
        bot.post(`#help:
    Shows you a list of commands.`, origin);
      } else if (message.split(" ")[1] === "uptime") {
        bot.post(`#uptime:
    Shows you how long the bot was online for.`, origin);
      } else if (message.split(" ")[1] === "uwu") {
        bot.post(`#uwu:
    Posts "UwU.`, origin);
      } else if (message.split(" ")[1] === "8ball") {
        bot.post(`#8ball:
    Makes a prediction.`, origin);
      } else if (message.split(" ")[1] === "zen") {
        bot.post(`#zen:
    Posts zen quotes from GitHub's API.`, origin);
      } else if (message.split(" ")[1] === "shorten") {
        bot.post(`#shorten:
    Shortens links via shortco.de's API.`, origin);
      } else if (message.split(" ")[1] === "zen") {
        bot.post(`#cat:
    Posts random cat pictures.`, origin);
      } else if (message.split(" ")[1] === "zen") {
        bot.post(`#status:
    Lets you view, and set a status.`, origin);
      } else if (message.split(" ")[1] === "credits") {
        bot.post(`#credits:
    Lists everyone behind ${username}!`, origin);
      } else if (message.split(" ")[1] === "karma") {
        bot.post(`#karma:
    Upvote, downvote, and view someone's karma.`, origin);
      } else if (message.split(" ")[1] === "mute") {
        bot.post(`#mute:
    Mutes the specified user. Must be a bot admin to do this.`, origin);
      } else if (message.split(" ")[1] === "unmute") {
        bot.post(`#unmute:
    Unmutes the specified user. Must be a bot admin to do this.`, origin);
      } else if (message.split(" ")[1] === "wordle") {
        bot.post(`#wordle:
    Lets you play wordle.`, origin);
      } else if (message.split(" ")[1] === "poll") {
        bot.post(`#poll:
    Create and answer polls.`, origin);
      } else {
        bot.post("This command doesn't exist!", origin);
        log(`${user} tried to get help on a command that does not exist. The command was "${message}"`);
      }
    }
  }

  if (message.startsWith(prefix + "uptime")) {
    bot.post(`${username} was online since ${toRelative(uptime)}.`, origin);
    log(`${user} used the command ${message}`);
  }

  if (message.startsWith(prefix + "uwu")) {
    bot.post("UwU", origin);
    log(`${user} used the command ${message}`);
  }

  if (message.startsWith(prefix + "8ball")) {
    let eightBall = ["It is certain.", "It is decidedly so.", "Without a doubt.", "Yes, definitely.", "You may rely on it.", "As I see it, yes.", "Most likely.", "Outlook good.", "Yes.", "Signs point to yes.", "Reply hazy, try again.", "Ask again later.", "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.", "Don't count on it.", "My reply is no.", "My sources say no.", "Outlook not so good.", "Very doubtful."];
    bot.post(eightBall[Math.floor(Math.random() * eightBall.length)], origin);
    log(`${user} used the command ${message}`);
  }

  if (message.startsWith(prefix + "zen")) {
    bot.post(await fetch("https://api.github.com/zen").then(res => res.text()), origin);
    log(`${user} used the command ${message}`);
  }

  if (message.startsWith(prefix + "shorten")) {
    if (message.split(" ")[1] === undefined) {
      bot.post("You need to specify a website to shorten!", origin);
      log(`${user} used the command ${message}`);
    } else {
      let link = await fetch(`https://api.shrtco.de/v2/shorten?url=${message.split(" ")[1]}`).then(res => res.json());
      bot.post(link.result.full_short_link, origin);
      log(`${user} used the command ${message}`);
    }
  }

  if (message.startsWith(prefix + "cat")) {
    let image = await fetch("https://aws.random.cat/meow").then(res => res.json());
    bot.post(`[?format=src: ${image.file}]`, origin);
    log(`${user} used the command ${message}`);
  }

  if (message.startsWith(prefix + "status")) {
    if (message.split(" ")[1] === "set") {
      db.set(`MDW125-STATUS-${user}`, message.split(" ").slice(2, message.split(" ").length).join(" "));
      bot.post("Status successfully set!", origin);
      log(`${user} set their status with the command "${message}"`);
    } else if (message.split(" ")[1] === "clear") {
      db.delete(`MDW125-STATUS-${user}`);
      bot.post("Status successfully cleared!", origin);
      log(`${user} cleared their status with the command "${message}"`);
    } else if (message.split(" ")[1] === "view") {
      if (message.split(" ")[2] === user) {
        if (!(db.has(`MDW125-STATUS-${user}`))) {
          bot.post("You don't have a status set. To set one, use #status set [message].", origin);
          log(`${user} tried to view their status, but they don't have one set. They used the command "[message]"`);
        } else {
          bot.post(`Your status:
    ${db.get("MDW125-STATUS-" + user)}`, origin);
          log(`${user} viewed their status with the command "${message}"`);
        }
      } else {
        if (db.has(`MDW125-STATUS-${user}`)) {
          bot.post(`@${message.split(" ")[2]}'s status:
    ${db.get("MDW125-STATUS-" + message.split(" ")[2])}`, origin);
          log(`${user} viewed someone else's status with the command "${message}"`);
        } else {
          bot.post(`@${message.split(" ")[2]} doesn't have a status set.`, origin);
          log(`${user} + " tried to view someone else's status, but they don't have one set. They used the command "${message}"`);
        }
      }
    } else {
      if (!(db.has(`MDW125-STATUS-${user}`))) {
        bot.post("You don't have a status set. To set one, use #status set [message].", origin);
        log(`${user} tried to view their status, but they don't have one set. They used the command "${message}"`);
      } else {
        bot.post(`Your status:
    ${db.get("MDW125-STATUS-" + user)}`, origin);
        log(`${user} viewed their status with the command "${message}"`);
      }
    }
  }

  if (message.startsWith(prefix + "credits")) {
    bot.post(`Creator: WlodekM
Hosting: WlodekM
Bot Library: MeowerBot.js`, origin);
    log(`${user} used the command ${message}`);
  }

  if (message.startsWith(prefix + "karma")) {
    if (message.split(" ")[1] === "upvote") {
      if (!(db.has(`MDW125-KARMA-${message.split(" ")[2]}`))) {
        if (message.split(" ")[2] === user) {
          bot.post("You can't upvote yourself!", origin);
          log(`${user} tried to upvote themselves unsucessfully with the command ${message}`);
        } else {
          db.set(`MDW125-KARMA-${message.split(" ")[2]}`, 1);
          bot.post(`Successfully upvoted @${message.split(" ")[2]}! They now have 1 karma.`, origin);
          log(`${user} upvoted someone with the command "${message}"`);
        }
      } else {
        if (message.split(" ")[2] === user) {
          bot.post("You can't upvote yourself!", origin);
          log(`${user} tried to upvote themselves unsucessfully with the command ${message}`);
        } else {
          db.set(`MDW125-KARMA-${message.split(" ")[2]}`, (parseInt(db.get(`MDW125-KARMA-${message.split(" ")[2]}`)) + 1));
          bot.post(`Successfully upvoted @${message.split(" ")[2]}! They now have ${db.get("MDW125-KARMA-" + message.split(" ")[2])} karma.`, origin);
          log(`${user} upvoted someone with the command "${message}"`);
        }
      }
    } else if (message.split(" ")[1] === "downvote") {
      if (!(db.has(`MDW125-KARMA-${message.split(" ")[2]}`))) {
        if (message.split(" ")[2] === user) {
          bot.post("You can't downvote yourself!", origin);
          log(`${user} tried to downvote themselves unsucessfully with the command "${message}"`);
        } else {
          db.set(`MDW125-KARMA-${message.split(" ")[2]}`, -1);
          bot.post(`Successfully downvoted @${message.split(" ")[2]}. They now have -1 karma.`, origin);
          log(`${user} downvoted someone with the command "${message}"`);
        }
      } else {
        if (message.split(" ")[2] === user) {
          bot.post("You can't downvote yourself!", origin);
          log(`${user} tried to downvote themselves unsucessfully with the command "${message}"`);
        } else {
          db.set(`MDW125-KARMA-${message.split(" ")[2]}`, (parseInt(db.get(`MDW125-KARMA-${message.split(" ")[2]}`)) - 1));
          bot.post(`Successfully downvoted @${message.split(" ")[2]}! They now have ${db.get("MDW125-KARMA-" + message.split(" ")[2])} karma.`, origin);
          log(`${user} downvoted someone with the command "${message}"`);
        }
      }
    } else if (message.split(" ")[1] === "view") {
      if (message.split(" ")[2] === user) {
        if (!(db.has(`MDW125-KARMA-${user}`))) {
          bot.post(`You have 0 karma.`, origin);
          log(`${user} viewed their 0 karma with the command "${message}"`);
        } else {
          bot.post(`You have ${db.get("MDW125-KARMA-" + user)} karma.`, origin);
          log(`${user} viewed their karma with the command "${message}"`);
        }
      } else {
        if (!(db.has(`MDW125-KARMA-${message.split(" ")[2]}`))) {
          bot.post(`@${message.split(" ")[2]} has 0 karma.`, origin);
          log(`${user} viewed someone else's 0 karma with the command "${message}"`);
        } else {
          bot.post(`@${message.split(" ")[2]} has ${db.get("MDW125-KARMA-" + message.split(" ")[2])} karma.`, origin);
          log(`${user} viewed someone else's karma with the command "${message}"`);
        }
      }
    } else {
      if (!(db.has(`MDW125-KARMA-${user}`))) {
        bot.post(`You have 0 karma.`, origin);
        log(`${user} viewed their 0 karma with the command "${message}"`);
      } else {
        bot.post(`You have ${db.get("MDW125-KARMA-" + user)} karma.`, origin);
        log(`${user} viewed their karma with the command "${message}"`);
      }
    }
  }

  if (message.startsWith(prefix + "mute")) {
    if (admins.includes(user)) {
      if (db.has(`MDW125-MUTED-${message.split(" ")[1]}`)) {
        bot.post(`@${message.split(" ")[1]} is already muted!`, origin);
        log(`${user} tried to mute someone, but they are already muted. They used the command "${message}"`);
      } else {
        if (message.split(" ")[2]) {
          db.set(`MDW125-MUTED-${message.split(" ")[1]}`, message.split(" ").slice(2, message.split(" ").length).join(" "));
        } else {
          db.set(`MDW125-MUTED-${message.split(" ")[1]}`, null);
        }
        bot.post(`Successfully muted @${message.split(" ")[1]}!`, origin);
        log(`${user} muted someone with the command "${message}"`);
      }
    } else {
      bot.post("You don't have the permissions to run this command.", origin);
      log(`${user} tried to mute someone, but they didn't have permission to do so. They used the command "${message}"`);
    }
  }

  if (message.startsWith(prefix + "unmute")) {
    if (admins.includes(user)) {
      if (!(db.has(`MDW125-MUTED-${message.split(" ")[1]}`))) {
        bot.post(`@${message.split(" ")[1]} isn't muted!`, origin);
        log(`${user} tried to unmute someone, but they weren't muted. They used the command "${message}"`);
      } else {
        db.delete(`MDW125-MUTED-${message.split(" ")[1]}`);
        bot.post(`Successfully unmuted @${message.split(" ")[1]}!`, origin);
        log(`${user} unmuted someone with the command "${message}"`);
      }
    } else {
      bot.post("You don't have the permissions to run this command.", origin);
      log(`${user} tried to unmute someone, but they didn't have permission to do so. They used the command "${message}"`);
    }
  }

  if (message.startsWith("#wordle")) {
    if (message.split(" ")[1] === "new") {
      wordle.init();
      bot.post("New Wordle game started! Use #wordle guess [word] to guess a word.", origin);
      log(`${user} started a Wordle game with the command "${message}"`);
    } else if (message.split(" ")[1] === "guess") {
      try {
        wordle.guess(message.split(" ")[2]);
        bot.post(`${wordle.grid[0].join("")}
${wordle.grid[1].join("")}
${wordle.grid[2].join("")}
${wordle.grid[3].join("")}
${wordle.grid[4].join("")}
${wordle.grid[5].join("")}          
`, origin);
      } catch (e) {
        bot.post(`${e}`, origin);
      }
    } else if (message.split(" ")[1] === "grid") {
      bot.post(`${wordle.grid[0].join("")}
${wordle.grid[1].join("")} 
${wordle.grid[2].join("")}
${wordle.grid[3].join("")}
${wordle.grid[4].join("")}
${wordle.grid[5].join("")}          
`, origin);
    }
  }

  if (message.startsWith("#poll")) {
    if (message.split(" ")[1] === "new") {
      let polls = db.get("MDW125-POLLS");
      polls.push({ "question": message.split(" ").slice(2, message.split(" ").length).join(" "), "id": polls.length + 1, "answers": [], "username": user });
      db.set("MDW125-POLLS", polls);
      bot.post("Succesfully created new poll!", origin);
      log(`${user} created a new poll with the command "${message}"`);
    } else if (message.split(" ")[1] === "answer") {
      let polls = db.get("MDW125-POLLS");
      if (user == polls[message.split(" ")[2] - 1].username) {
        bot.post("You can't answer a poll you made!", origin);
        log(`${user} tried to answer a poll they created with the command "${message}"`);
      } else if (polls[message.split(" ")[2] - 1] == undefined) {
        bot.post("This poll doesn't exist!");
      } else {
        polls[message.split(" ")[2] - 1].answers.push({ "username": user, "answer": message.split(" ").slice(3, message.split(" ").length).join(" ") });
        db.set("MDW125-POLLS", polls);
        bot.post("Successfully answered poll!", origin);
        log(`${user} answered a poll with the command "${message}"`);
      }
    } else {
      let polls = db.get("MDW125-POLLS");

      for (let i in polls) {
        if (polls[i].username == user) {
          polls.splice(i, 1);
        }
      }

      let randomPoll = polls[Math.floor(Math.random() * polls.length)];

      try {
        bot.post(`Random poll: ${randomPoll.question}
    To answer this poll, use #poll answer ${randomPoll.id} [answer].`, origin);
        log(`${user} found a random poll with the command "${message}"`);
      } catch (e) {
        bot.post("There are no polls to answer! Check back later or create a poll with #poll new [poll].", origin);
      }
    }
  }
  /*============ NEW CODE ============*/
  if (message.startsWith(prefix + "random")) {
    bot.post(String(Math.round(Math.random())), origin);
    log(`${user} used the command ${message}`);
    console.log(Math.round(Math.random()))
  }

  if (message.startsWith(prefix + "whois")) {
    if (message.split(" ")[1] === undefined) {
      bot.post("You need to specify a user!", origin);
      log(`${user} used the command ${message}`);
    } else {
      let messagea = message.split(" ")[1]
      messagea = messagea + "\n"
      messagea = messagea + "stats here ig"
      bot.post(messagea, origin);
    }
  }

  if (message.startsWith("@" + process.env["MDW125_USERNAME"])) {
    let messagea = "Hi, i'm @" + process.env["MDW125_USERNAME"] + ". \nMy prefix is \"#\". See #help for more info"
    bot.post(messagea, origin);
  }

  if (message.startsWith(prefix + "repeat")) {
    if (admins.includes(user)) {
      var messageb = message.split(" ")
      messageb.splice(0, 1)[0];
      messageb = messageb.join(' ')
      bot.post(messageb);
      bot.post(messageb);
      bot.post(messageb);
      bot.post(messageb);
      bot.post(messageb);
      bot.post(messageb);
      bot.post(messageb);
    } else {
      bot.post("You don't have the permissions to run this command.", origin);
      log(`${user} tried to mute someone, but they didn't have permission to do so. They used the command "${message}"`);
    }
  }

  if (message.startsWith(prefix + "eval")) {
    if (admins.includes(user)) {
      var messageb = message.split(" ")
      messageb.splice(0, 1)[0];
      messageb = messageb.join(' ')
      
      bot.post(eval(messageb));

    } else {
      bot.post("You don't have the permissions to run this command.", origin);
      log(`${user} tried to mute someone, but they didn't have permission to do so. They used the command "${message}"`);
    }
  }

  if (message.startsWith(prefix + "balance")) {
    if (!(money.has(`${user}`))){;money.set(`${user}`, 0);};
    bot.post(String(`Hello, ${user}!\nYour balance is `+money.get(`${user}`)), origin)
    log(`${user} used the command ${message}`);
    console.log(Math.round(Math.random()))
  }

  if (message.startsWith(prefix + "work")) {
    log(`${user} used the command ${message}`);
    if (!(money.has(`${user}`))){money.set(`${user}`, 0)}
    if (!(db.has(`WORK-${user}`))){db.set(`WORK-${user}`, 0)}
    //idk why but the previous ode didn't work
    if (  (300 - (gettime()-db.get(`WORK-${user}`))) <= 0 ){ 
    let earned = 25 + mathRandomInt(-7,7)
      let ear = String(earned)
    bot.post(String(`Hello, ${user}!\nYou earned ${ear}`), origin)
    db.set(`WORK-${user}`, gettime())
    money.set(`${user}`, (money.get(`${user}`+earned)))
    } else {
      let cooldown = String(300 - (gettime()-db.get(`WORK-${user}`)))
      bot.post(`You need to wait ${cooldown} more seconds`, origin)
    }
  }

  if (message.startsWith(prefix + "leaderboard")) {
    log(`${user} used the command ${message}`);
    var lb = money  //money is the db of money.json
    var tosay = Object.entries(lb).sort((a, b) => b[1] - a[1])
    console.log(`============\n${tosay}\n============`)
    bot.post(`This command is WIP`, origin)
  }
  /*============ OLD CODE ============*/
});

bot.onMessage((messageData) => {
  console.log(`New message: ${messageData}`);
});

bot.onClose(() => {
  /*============ NEW CODE ============*/
  console.log('bot is ded');
  /*============ OLD CODE ============*/
  let command = exec("npm run start");
  command.stdout.on("data", (output) => {
    console.log(output.toString());
  });
});

bot.onLogin(() => {
  log(`Logged on as user ${username}`);
  bot.post(`${username} is now online! Use #help to see a list of commands.`);
});

