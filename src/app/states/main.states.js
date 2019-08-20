function register(voxaApp) {
  // This will run when the user launches the skill 
  voxaApp.onIntent("LaunchIntent", () => {
    return {
      flow: "continue",
      reply: "Welcome",
      to: "askHowManyWins",
    };
  });

  // This one will ask the amounts of wins necessary to beat, or be beaten
  voxaApp.onState("askHowManyWins", () => {
    return {
      flow: "yield",
      reply: "AskHowManyWins",
      to: "getHowManyWins",
    };
  });

  // This one will wait until the user responds with amounts of wins
  voxaApp.onState("getHowManyWins", voxaEvent => {
    if (voxaEvent.intent.name === "MaxWinsIntent") {
      voxaEvent.model.wins = voxaEvent.intent.params.wins;
      voxaEvent.model.userWins = 0;
      voxaEvent.model.alexaWins = 0;
      return {
        flow: "continue",
        reply: "StartGame",
        to: "askUserChoice",
      };
    }
  });

  // Choices
  const CHOICES = ['rock', 'paper', 'scissors'];

  // we check if the user or Alexa won or proceed to ask user's choice
  voxaApp.onState("askUserChoice", voxaEvent => {
    const userWon = parseInt(voxaEvent.model.userWins) >= parseInt(voxaEvent.model.wins);
    const alexaWon = parseInt(voxaEvent.model.alexaWins) >= parseInt(voxaEvent.model.wins);

    if (userWon) {
      return {
        flow: "continue",
        reply: "UserWinsTheGame",
        to: "askIfStartANewGame",
      };
    }

    if (alexaWon) {
      return {
        flow: "continue",
        reply: "AlexaWinsTheGame",
        to: "askIfStartANewGame",
      };
    }

    const min = 0;
    const max = CHOICES.length - 1;
    voxaEvent.model.userChoice = undefined;
    voxaEvent.model.alexaChoice = Math.floor(Math.random() * (max - min + 1)) + min;

    return {
      flow: "yield",
      reply: "AskUserChoice",
      to: "getUserChoice",
    };
  });

  // After asking the user for his choice
  voxaApp.onState("getUserChoice", voxaEvent => {
    if (voxaEvent.intent.name === "RockIntent") {
      voxaEvent.model.userChoice = "rock";
    } else if (voxaEvent.intent.name === "PaperIntent") {
      voxaEvent.model.userChoice = "paper";
    } else if (voxaEvent.intent.name === "ScissorsIntent") {
      voxaEvent.model.userChoice = "scissors";
    }

    if (voxaEvent.model.userChoice) {
      return {
        flow: "continue",
        to: "processWinner",
      };
    }
  });

  // It defines who won this match 
  voxaApp.onState("processWinner", voxaEvent => {
    const alexaChoice = CHOICES[voxaEvent.model.alexaChoice];
    const { userChoice } = voxaEvent.model;
    let reply = "TiedResult";

    if (alexaChoice === userChoice) {
      return {
        flow: "continue",
        reply,
        to: "askUserChoice",
      };
    }

    if (alexaChoice === "rock") {
      if (userChoice === "paper") {
        voxaEvent.model.userWins += 1;
        reply = "UserWins";
      }

      if (userChoice === "scissors") {
        voxaEvent.model.alexaWins += 1;
        reply = "AlexaWins";
      }
    }

    if (alexaChoice === "paper") {
      if (userChoice === "scissors") {
        voxaEvent.model.userWins += 1;
        reply = "UserWins";
      }

      if (userChoice === "rock") {
        voxaEvent.model.alexaWins += 1;
        reply = "AlexaWins";
      }
    }

    if (alexaChoice === "scissors") {
      if (userChoice === "rock") {
        voxaEvent.model.userWins += 1;
        reply = "UserWins";
      }

      if (userChoice === "paper") {
        voxaEvent.model.alexaWins += 1;
        reply = "AlexaWins";
      }
    }

    return {
      flow: "continue",
      reply,
      to: "askUserChoice",
    };
  });

  // If someone won then we ask if the user wants to start a new game
  voxaApp.onState("askIfStartANewGame", () => {
    return {
      flow: "yield",
      reply: "AskIfStartANewGame",
      to: "shouldStartANewGame",
    };
  });

  // Check if the user said “yes” or “no”
  voxaApp.onState("shouldStartANewGame", voxaEvent => {
    if (voxaEvent.intent.name === "YesIntent") {
      return {
        flow: "continue",
        reply: "RestartGame",
        to: "askHowManyWins",
      };
    }

    if (voxaEvent.intent.name === "NoIntent") {
      return {
        flow: "terminate",
        reply: "Bye",
      };
    }
  });

  // If the user wants to quit the skill in the middle of a game
  voxaApp.onIntent("CancelIntent", () => {
    return {
      flow: "terminate",
      reply: "Bye",
    };
  });

  // If the user wants to quit the skill in the middle of a game
  voxaApp.onIntent("StopIntent", () => {
    return {
      flow: "terminate",
      reply: "Bye",
    };
  });
}

module.exports = register;
