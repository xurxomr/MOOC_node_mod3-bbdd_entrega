const {User, Score} = require("./model.js").models;

// Prints ScoreBoard
exports.scoreboard = async (rl) => {
  let scores = await Score.findAll(
    { include: [{
        model: User,
        as: 'user'
      }]
    }
  );
  scores.forEach(
    s => rl.log(`  ${s.user.name}\t\t${s.wins}\t\t ${s.createdAt.toUTCString()}`)
  );
  }

  // Creates new score entry
  exports.create = async (rl) => {
    throw new Error("Not implemented yet!");
  }