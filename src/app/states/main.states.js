function register(voxaApp) {
  // voxaApp.onIntent("LaunchIntent", {
  //   flow: "terminate",
  //   reply: "Launch.StartResponse",
  // });

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
}

module.exports = register;
