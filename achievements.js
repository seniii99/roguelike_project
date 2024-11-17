// achievements.js
import chalk from 'chalk';

class Achievements {
  constructor() {
    this.achievements = {
      firstStageClear: false,
      collect100Gold: false,
      defeatFinalBoss: false,
    };
  }

  // 업적을 달성했을 때 상태 갱신
  achieve(achievement) {
    if (this.achievements[achievement] !== undefined && !this.achievements[achievement]) {
      this.achievements[achievement] = true;
      console.log(chalk.green(`축하합니다! 업적 달성: ${achievement}`));
    }
  }

  // 업적 목록 출력
  showAchievements() {
    console.clear();
    console.log(chalk.cyan('=== 업적 ==='));
    for (const [key, value] of Object.entries(this.achievements)) {
      const status = value ? chalk.green('달성') : chalk.red('미달성');
      console.log(`${key}: ${status}`);
    }
    console.log(chalk.magentaBright('=====================\n'));
  }
}

export default Achievements;
