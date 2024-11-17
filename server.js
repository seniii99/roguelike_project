import chalk from 'chalk';
import figlet from 'figlet';
import readlineSync from 'readline-sync';
import { startGame } from './game.js';
import { achievements } from './achievements.js';

function checkAchievements() {
  console.clear();
  console.log(
    chalk.cyan(
      figlet.textSync('Achievements', {
        font: 'Standard',
        horizontalLayout: 'default',
        verticalLayout: 'default',
      }),
    ),
  );

  achievements.forEach((achievement) => {
    const status = achievement.achieved ? chalk.green('달성 완료') : chalk.red('미완료');
    console.log(`${chalk.yellow(achievement.name)}: ${achievement.description} - ${status}`);
  });

  readlineSync.question('\n[엔터] 키를 눌러 로비로 돌아갑니다...');
  displayLobby();
}

function displayLobby() {
  console.clear();

  console.log(
    chalk.cyan(
      figlet.textSync('RL- Javascript', {
        font: 'Standard',
        horizontalLayout: 'default',
        verticalLayout: 'default',
      }),
    ),
  );

  console.log(chalk.magentaBright('='.repeat(50)));
  console.log(chalk.yellowBright('CLI 게임에 오신 것을 환영합니다!'));
  console.log(chalk.green('옵션을 선택하세요.'));
  console.log(chalk.blue('1.') + chalk.white(' 새로운 게임 시작'));
  console.log(chalk.blue('2.') + chalk.white(' 업적 확인'));
  console.log(chalk.blue('3.') + chalk.white(' 종료'));
  console.log(chalk.magentaBright('='.repeat(50)));

  handleUserInput(); // 게임이 종료되지 않도록 로비에서 사용자 입력을 받음
}

function handleUserInput() {
  const choice = readlineSync.question('입력: ');

  switch (choice) {
    case '1':
      startGame();
      break;
    case '2':
      checkAchievements();
      break;
    case '3':
      console.log(chalk.red('게임을 종료합니다.'));
      process.exit();
      break;
    default:
      console.log(chalk.red('잘못된 입력입니다. 다시 시도해주세요.'));
      handleUserInput();
  }
}

function start() {
  displayLobby();
  handleUserInput();
}

start();
