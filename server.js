const express = require("express");
const _ = require("lodash");
const {
  alexaSkill,
} = require("./src/app");
const config = require("./src/config");

const expressApp = express();
expressApp.use(express.json());


const routes = {
  "/alexa": alexaSkill,
};

if (config.server.hostSkill) {
  _.map(routes, (handler, route) => {
    expressApp.post(
      route,
      async (req, res, next) => {
        try {
          const reply = await handler.execute(req.body);
          res.json(reply);
        } catch (e) {
          next(e);
        }
      }
    );
  });
}

expressApp.listen(config.server.port);
exports.expressApp = expressApp;
