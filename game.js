import chalk from 'chalk';
import readlineSync from 'readline-sync';
import Achievements from './achievements.js';

class Player {
  constructor() {
    // 플레이어의 초기 상태
    this.hp = 100;
    this.gold = 20; // 플레이어가 보유한 골드
    this.attackPower = 20; // 기본 공격력
  }

  attack() {
    const damage = Math.floor(Math.random() * 11) + this.attackPower; // 공격력에 따라 피해 계산
    console.log(chalk.green(`플레이어가 ${damage}의 피해를 주었습니다.`));
    return damage;
  }

  multiAttack() {
    const rand = Math.random();
    let totalDamage = 0;

    // 30% 확률로 연속 공격
    if (rand < 0.3) {
      console.log(chalk.blue('연속 공격 발동!'));
      for (let i = 0; i < 2; i++) {
        const damage = this.attack(); // 연속 공격 시 각 공격마다 damage 계산
        totalDamage += damage; // totalDamage에 damage 누적
        console.log(chalk.green(`연속 공격 ${i + 1}: ${damage}의 피해!`));
      }
      console.log(chalk.blue(`연속 공격으로 총 ${totalDamage}의 피해를 주었습니다!`));
    } else {
      console.log(chalk.green('연속 공격이 발동하지 않았습니다.'));
      // 연속 공격 실패 시 totalDamage가 0
      totalDamage = 0;
    }

    return totalDamage;
  }

  buyWeapon() {
    let validChoice = false; // 무기 구매 시 유효한 선택 여부 확인

    while (!validChoice) {
      // 플레이어가 유효한 선택할 때까지 반복
      console.log(chalk.blue(`=== 상점 ===`));
      console.log(chalk.yellow(`1. 돌칼 - 50골드 (공격력 +10)`));
      console.log(chalk.yellow(`2. 철칼 - 100골드 (공격력 +20)`));
      console.log(chalk.yellow(`3. 퇴장`));

      // readlineSync로 유저에게 무기 선택을 받는다.
      const choice = readlineSync.question('무기를 구매하시겠습니까? 선택: ');

      switch (choice) {
        case '1': // 돌칼 구매
          if (this.gold >= 50) {
            this.gold -= 50; // 보유 골드에서 50골드 차감
            this.attackPower += 10; // 공격력 10 증가
            console.log(chalk.green('돌칼을 구매하여 공격력이 +10 되었습니다.'));
            validChoice = true; // 유효한 선택이므로 루프 종료
          } else {
            console.log(chalk.red('골드가 부족합니다.'));
          }
          break;

        case '2': // 철칼 구매
          if (this.gold >= 100) {
            this.gold -= 100; // 보유 골드에서 100골드 차감
            this.attackPower += 20; // 공격력 20 증가
            console.log(chalk.green('철칼을 구매하여 공격력이 +20 되었습니다.'));
            validChoice = true; // 유효한 선택이므로 루프 종료
          } else {
            console.log(chalk.red('골드가 부족합니다.'));
          }
          break;

        case '3': // 퇴장
          console.log(chalk.blue('상점을 떠났습니다.'));
          validChoice = true; // 퇴장 선택 시 루프 종료
          break;

        default:
          console.log(chalk.red('잘못된 선택입니다. 다시 시도해주세요.'));
          break;
      }
    }
  }
}

class Monster {
  constructor(stage) {
    this.hp = 100 + (stage - 1) * 10; // 각 스테이지마다 몬스터 HP 증가
  }

  attack() {
    const damage = Math.floor(Math.random() * 11) + 10;
    console.log(chalk.red(`몬스터가 ${damage}의 피해를 주었습니다.`));
    return damage;
  }

  dropGold() {
    // 몬스터 처치 시 10~50골드 사이의 랜덤 골드 드랍
    const gold = Math.floor(Math.random() * 41) + 10;
    console.log(chalk.yellow(`몬스터가 ${gold}골드를 드랍했습니다.`));
    return gold;
  }
}

// 카운터 기능: 30% 확률로 몬스터의 공격을 막고, 2배 데미지로 반격
function counterAttack(player, monster, logs) {
  const randomChance = Math.random(); // 0~1 사이의 랜덤 값

  console.log(chalk.yellow('카운터 어택을 시도합니다...'));

  if (randomChance < 0.3) {
    // 30% 확률로 카운터 발동
    console.log(chalk.green('카운터 발동! 몬스터의 공격을 막고 반격합니다.'));
    const counterDamage = player.attackPower * 2; // 2배 데미지
    monster.hp -= counterDamage; // 몬스터 hp에서 데미지 차감
    console.log(chalk.red(`반격 데미지: ${counterDamage}`));
    console.log(chalk.red(`몬스터 체력: ${monster.hp}`));

    // 카운터 성공 로그 추가
    logs.push(
      chalk.green(
        `카운터 발동! 몬스터의 공격을 막고 반격하여 ${counterDamage}의 피해를 주었습니다.`,
      ),
    );
  } else {
    // 카운터 실패 시
    console.log(chalk.red('카운터 실패!'));
    const monsterDamage = monster.attack(); // 몬스터가 플레이어에게 피해를 입힘
    player.hp -= monsterDamage; // 플레이어 hp에서 데미지 차감
    console.log(chalk.red(`몬스터의 반격! 플레이어의 HP가 ${monsterDamage}만큼 감소하였습니다.`));

    if (player.hp <= 0) {
      console.log(chalk.red('플레이어가 사망하였습니다.'));
    }

    // 카운터 실패 로그 추가
    logs.push(chalk.red('카운터 실패! 몬스터의 공격을 피하지 못했습니다.'));
  }
}

function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=== Current Status ===`)); // /n은 새 줄을 시작하게 하는 기능
  console.log(
    chalk.cyanBright(`| Stage: ${stage} `) +
      chalk.blueBright(
        `| 플레이어 HP: ${player.hp} | 골드: ${player.gold} | 공격력: ${player.attackPower}`,
      ),
  );
  console.log(chalk.redBright(`| 몬스터 HP: ${monster.hp} |`));
  console.log(chalk.magentaBright(`=====================\n`));
}

const battle = async (stage, player, monster) => {
  let logs = []; // 전투 중 발생하는 로그 기록 배열

  // 플레이어와 몬스터 모두 hp가 0 초과일 때까지 계속해서 진행
  while (player.hp > 0 && monster.hp > 0) {
    console.clear(); // 매 턴마다 화면 갱신
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log)); // logs 배열에 저장된 전투 로그들을 하나씩 출력

    console.log(chalk.green(`\n1. 공격한다 2. 연속 공격 3. 카운터 어택 4. 상점에 간다`));
    const choice = readlineSync.question('당신의 선택은? ');

    switch (choice) {
      case '1': // 일반 공격
        const damage = player.attack();
        monster.hp -= damage;
        logs.push(chalk.green(`플레이어가 공격하여 몬스터의 HP가 ${damage}만큼 감소하였습니다.`));

        // 몬스터 처치
        if (monster.hp <= 0) {
          const gold = monster.dropGold(); // 몬스터가 골드 드랍
          player.gold += gold;
          logs.push(chalk.blueBright('몬스터를 처치하였습니다!'));
          break;
        }

        const monsterDamage = monster.attack();
        player.hp -= monsterDamage;
        logs.push(chalk.red(`몬스터의 반격! 플레이어의 HP가 ${monsterDamage}만큼 감소하였습니다.`));

        if (player.hp <= 0) {
          logs.push(chalk.red('플레이어가 사망하였습니다.'));
          break;
        }
        break;

      case '2': // 연속 공격
        const multiDamage = player.multiAttack();
        monster.hp -= multiDamage;
        // 멀티 공격 성공시
        if (multiDamage > 0) {
          logs.push(
            chalk.green(
              `플레이어가 연속 공격하여 몬스터의 HP가 ${multiDamage}만큼 감소하였습니다.`,
            ),
          );
        } else {
          logs.push(chalk.green('연속 공격 실패...'));
        }

        // 연속 공격으로 몬스터 처치
        if (monster.hp <= 0) {
          const gold = monster.dropGold(); // 몬스터가 골드 드랍
          player.gold += gold;
          logs.push(chalk.blueBright('몬스터를 처치하였습니다!'));
          break;
        }

        const monsterDamage2 = monster.attack();
        player.hp -= monsterDamage2;
        logs.push(
          chalk.red(`몬스터의 반격! 플레이어의 HP가 ${monsterDamage2}만큼 감소하였습니다.`),
        );

        if (player.hp <= 0) {
          logs.push(chalk.red('플레이어가 사망하였습니다.'));
          break;
        }
        break;

      case '3': // 카운터
        counterAttack(player, monster, logs);
        break;

      case '4': // 상점
        player.buyWeapon(); // 상점으로 이동
        break;

      default:
        logs.push(chalk.red('잘못된 선택입니다. 다시 선택해주세요.'));
        break;
    }
  }

  // 몬스터 처치 시 골드 드랍과 스테이지 클리어 로그 출력
  if (monster.hp <= 0) {
    const gold = monster.dropGold(); // 몬스터가 골드 드랍
    player.gold += gold;
    logs.push(chalk.yellow(`몬스터 처치 후 ${gold}골드를 드랍했습니다.`));
    logs.push(chalk.blueBright(`스테이지 ${stage} 클리어!`));

    // 클리어 후 잠시 대기
    await new Promise((resolve) => setTimeout(resolve, 2000)); // 2초 대기
  }
};

// 외부에서 업적 전달
export async function startGame(achievements) {
  console.clear();
  const player = new Player();
  let stage = 1; // 초기값을 1로 설정

  // 스테이지가 10 이하인 동안 계속 진행, 플레이어 hp가 0 이하가 되면 종료
  while (stage <= 10 && player.hp > 0) {
    const monster = new Monster(stage);
    await battle(stage, player, monster);

    if (player.hp <= 0) {
      console.log(chalk.red('게임 오버!'));
      break;
    }

    player.hp = Math.min(player.hp + 70, 100); // 최대 HP는 100으로 제한
    console.log(
      chalk.green(`스테이지 ${stage} 클리어! HP가 50만큼 회복되었습니다. 현재 HP: ${player.hp}`),
    );

    if (stage === 1) {
      achievements.achieve('firstStageClear'); // 첫 번째 스테이지 클리어 업적
    }
    if (player.gold >= 100) {
      achievements.achieve('collect100Gold'); // 100골드 모으기 업적
    }

    stage++;
  }

  if (player.hp > 0) {
    console.log(chalk.green('축하합니다! 모든 스테이지를 클리어했습니다.'));
    achievements.achieve('defeatFinalBoss'); // 최종 보스 처치 업적
  }
  achievements.showAchievements();
}
