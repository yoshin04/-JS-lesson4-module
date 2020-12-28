import { Quiz } from "./quiz-class.js";
const quizApi = "https://opentdb.com/api.php?amount=10";

const title = document.getElementById('title');
const genre = document.getElementById('genre');
const difficulty = document.getElementById('difficulty');
const question = document.getElementById('question');
const answersArea = document.getElementById('answers');
const startButton = document.getElementById('start_button');

startButton.addEventListener('click', () => {
  startButton.hidden = true;
  fetchQuizData(1);
});

const fetchQuizData = async (index) => {
  try {
    title.innerText = "取得中";
    question.innerText = "少々お待ち下さい";

    const response = await fetch(quizApi);
    const quizData = await response.json();
    const quiz = new Quiz(quizData);

    setNextQuiz(quiz, index);
  } catch (err) {
    alert('ERR:' + err)
  }
}

const setNextQuiz = (quiz, index) => {
  while (answersArea.firstChild) {
    answersArea.removeChild(answersArea.firstChild);
  }
  if (index <= quiz.getNumQuizzes()) {
    makeQuiz(quiz, index);
  } else {
    finishQuiz(quiz);
  }
}

const makeQuiz = (quiz, index) => {
  title.innerText = `問題 ${index}`;
  genre.innerText = `[ジャンル] ${quiz.getQUizCategory(index)}`;
  difficulty.innerText = `[難易度] ${quiz.getQuizDifficulty(index)}`;
  question.innerText = `[クイズ] ${quiz.getQuizQuestion(index)}`;

  const answers = buildAnswers(quiz, index);

  answers.forEach((answer) => {
    const answerElement = document.createElement('li');
    answersArea.appendChild(answerElement);

    const buttonElement = document.createElement('button');
    buttonElement.innerText = answer;
    answersArea.appendChild(buttonElement);
    buttonElement.addEventListener('click', () => {
      quiz.countCorrectAnswers(index, answer);
      index++;
      answersArea.removeChild(answersArea.firstChild);
      setNextQuiz(quiz, index);
    });
  });
}

const shuffleArray = ([...array]) => {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const buildAnswers = (quiz, index) => {
  const answers = [
    quiz.getCorrectAnswer(index),
    ...quiz.getIncorrectAnswers(index)
  ];
  return shuffleArray(answers);
}

const finishQuiz = (quiz) => {
  title.innerText = `あなたの正答数は${quiz.getCorrectAnswersNum()}です。`;
  genre.innertext = '';
  difficulty.innerText = '';
  question.innerText = '再チャレンジしたい場合は書きをクリック';

  const restartButton = document.createElement('button');
  restartButton.innerText = 'ホームに戻る';
  answersArea.appendChild(restartButton);
  restartButton.addEventListener('click', () => {
    location.reload();
  });
}
