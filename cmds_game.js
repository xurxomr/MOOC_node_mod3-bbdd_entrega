
const {User, Quiz, Score} = require("./model.js").models;

// Uses Fisher-Yates algorithm to shuffle our array of quizzes
const shuffle = array => {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Play ramdom quizzes
exports.play = async (rl) => {
    const quizzes = await Quiz.findAll();;

    shuffle(quizzes);

    const score = await runQuizzes(rl, quizzes);

    rl.log(`\n\n\n    Score: ${score}`);

    saveScore(rl, score);
  }

const runQuizzes = async (rl, quizzes) => {
    let score = 0;

    for(let quiz of quizzes){
        let success = await runQuiz(rl, quiz);

        if(success)
            score++;
        else
            break;
    };

    return score;
}

const runQuiz = async (rl, quiz) => {
    let answered = await rl.questionP(quiz.question);
  
    if (answered.toLowerCase().trim()===quiz.answer.toLowerCase().trim()) {
      rl.log(`  The answer "${answered}" is right!\n`);
      return true;
    } else {
      rl.log(`  The answer "${answered}" is wrong!\n`);
      return false;
    }
}

const saveScore = async (rl, score) => {
    let name;

    do{
        name = await rl.questionP("Enter your name")
        if (!name) throw new Error("Name can't be empty!");
    }while(!name)

    let user = await User.findOne({where: {name}});

    if (!user){ 
        user = await User.create({ name, age: 0 });
        rl.log(`User ('${name}') doesn't exist. Created new user.`);
    }

    await Score.create( 
        { wins: score,
          userId: user.id
        }
    );
}