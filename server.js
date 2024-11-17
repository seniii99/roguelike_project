import chalk from 'chalk';
import figlet from 'figlet';
import readlineSync from 'readline-sync';
import { startGame } from './game.js';
import Achievements from './achievements.js';

// 업적 관리 객체 생성
const achievements = new Achievements();

// 로비 화면을 출력하는 함수
function displayLobby() {
  console.clear();

  // 타이틀 텍스트
  console.log(
    chalk.cyan(
      figlet.textSync('RL- Javascript', {
        font: 'Standard',
        horizontalLayout: 'default',
        verticalLayout: 'default',
      }),
    ),
  );

  // 상단 경계선
  const line = chalk.magentaBright('='.repeat(50));
  console.log(line);

  // 게임 이름
  console.log(chalk.yellowBright.bold('CLI 게임에 오신것을 환영합니다!'));

  // 설명 텍스트
  console.log(chalk.green('옵션을 선택해주세요.'));
  console.log();

  // 옵션들
  console.log(chalk.blue('1.') + chalk.white(' 새로운 게임 시작'));
  console.log(chalk.blue('2.') + chalk.white(' 업적 확인하기'));
  console.log(chalk.blue('3.') + chalk.white(' 옵션'));
  console.log(chalk.blue('4.') + chalk.white(' 종료'));

  // 하단 경계선
  console.log(line);

  // 하단 설명
  console.log(chalk.gray('1-4 사이의 수를 입력한 뒤 엔터를 누르세요.'));

  handleUserInput(); // 유저 입력을 받도록 호출
}

// 유저 입력을 받아 처리하는 함수
function handleUserInput() {
  const choice = readlineSync.question('입력: ');

  switch (choice) {
    case '1':
      console.log(chalk.green('게임을 시작합니다.'));
      // 게임 시작
      startGame(achievements); // achievements 인스턴스를 startGame에 전달
      break;
    case '2':
      console.log(chalk.yellow('업적 확인 중...'));
      showAchievements();
      break;
    case '3':
      console.log(chalk.blue('옵션 설정 중...'));
      // 옵션 설정 로직 추가
      break;
    case '4':
      console.log(chalk.red('게임을 종료합니다.'));
      process.exit(0); // 게임 종료
      break;
    default:
      console.log(chalk.red('올바른 선택을 하세요.'));
      handleUserInput(); // 유효하지 않은 입력일 경우 다시 입력 받음
  }
}

// 업적 확인 함수
function showAchievements() {
  achievements.showAchievements();
  handleUserInput(); // 입력 대기
}

// 게임 시작 함수
function start() {
  displayLobby();
}

// 게임 실행
start();
