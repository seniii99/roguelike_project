import chalk from 'chalk';
import readlineSync from 'readline-sync';
// 업적 업데이트 함수 추가
import { achievements } from './achievements.js'; // 업적 데이터를 분리하여 로드

class Player {
  constructor(stage) {
    this.maxHp = 100 + (stage - 1) * 50;
    this.hp = this.maxHp;
    this.attackPower = 20;
    this.gold = 0;
    this.weapon = null;
  }

  attack(monster) {
    const damage = Math.floor(Math.random() * 20) + 10 + this.attackPower;
    monster.hp -= damage;

    if (this.weapon && this.weapon.stealHp) {
      const healAmount = Math.floor(damage * 0.1);
      this.hp += healAmount;
      console.log(chalk.green(`무기 효과로 ${healAmount}만큼 체력을 회복했습니다.`));
    }

    return damage;
  }

  heal() {
    const healAmount = Math.floor(Math.random() * 20) + 10;
    this.hp += healAmount;
    return healAmount;
  }

  buyWeapon(weapon) {
    if (this.gold >= weapon.price) {
      this.gold -= weapon.price;
      this.weapon = weapon;
      this.attackPower += weapon.attackBonus;
      console.log(chalk.green(`무기 '${weapon.name}'을 구입했습니다!`));
      // 첫 번째 무기 구매 업적 달성
      if (!achievements[2].achieved) {
        achievements[2].achieved = true;
        console.log(chalk.green('첫 번째 무기 구매 업적을 달성했습니다!'));
      }
    } else {
      console.log(chalk.red('골드가 부족합니다.'));
      return false; // 무기 구입 실패 false
    }
    return true; // 무기 구입 성공 true
  }
}

class Monster {
  constructor(stage) {
    this.hp = 100 + (stage - 1) * 20;
  }

  attack(player) {
    const damage = Math.floor(Math.random() * 5) + 5;
    player.hp -= damage;
    return damage;
  }
}

class Weapon {
  constructor(name, attackBonus, stealHp, price) {
    this.name = name;
    this.attackBonus = attackBonus;
    this.stealHp = stealHp;
    this.price = price;
  }
}

function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage} `) +
      chalk.blueBright(`| 플레이어 HP: ${player.hp}`) +
      chalk.redBright(`| 몬스터 HP: ${monster.hp}`) +
      chalk.yellowBright(`| 골드: ${player.gold} |`),
  );
  console.log(chalk.magentaBright(`=====================\n`));
}

const battle = async (stage, player, monster, logs) => {
  console.log(
    chalk.cyanBright(`\n[스테이지 ${stage} 시작] 현재 플레이어 공격력: ${player.attackPower}`),
  );

  while (player.hp > 0 && monster.hp > 0) {
    displayStatus(stage, player, monster);
    logs.forEach((log) => console.log(log));

    console.log(chalk.green(`\n1. 공격한다 2. 연속 공격. 3. 아무것도 하지 않는다.`));
    const choice = readlineSync.question('당신의 선택은? ');

    console.log(chalk.green(`${choice}를 선택하셨습니다.`));

    switch (choice) {
      case '1': {
        const playerDamage = player.attack(monster);
        console.log(chalk.green(`플레이어가 몬스터에게 ${playerDamage}의 피해를 입혔습니다.`));
        break;
      }
      case '2': {
        if (Math.random() < 0.3) {
          const firstAttackDamage = player.attack(monster);
          console.log(
            chalk.green(`플레이어가 몬스터에게 ${firstAttackDamage}의 피해를 입혔습니다.`),
          );

          const secondAttackDamage = player.attack(monster);
          console.log(
            chalk.green(
              `플레이어가 30% 확률로 추가 공격을 성공했습니다! 몬스터에게 ${secondAttackDamage}의 피해를 입혔습니다.`,
            ),
          );
        } else {
          console.log(chalk.yellow(`연속 공격에 실패했습니다.`));
        }
        break;
      }
      case '3':
        console.log(chalk.yellow(`플레이어는 아무것도 하지 않았습니다.`));
        break;
      default:
        console.log(chalk.red(`잘못된 선택입니다. 다시 선택해 주세요.`));
        continue;
    }

    if (monster.hp > 0) {
      const monsterDamage = monster.attack(player);
      console.log(chalk.red(`몬스터가 플레이어에게 ${monsterDamage}의 피해를 입혔습니다.`));
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  if (monster.hp <= 0) {
    const goldDropped = Math.floor(Math.random() * 50) + 20;
    player.gold += goldDropped;
    console.log(
      chalk.yellowBright(`몬스터를 처치하였습니다! 몬스터가 ${goldDropped} 골드를 드랍했습니다.`),
    );

    player.gold += goldDropped;

    const healAmount = Math.floor(player.maxHp * 0.3);
    player.hp = Math.min(player.hp + healAmount, player.maxHp);
    console.log(
      chalk.green(
        `스테이지 클리어로 체력이 ${healAmount}만큼 회복되었습니다. 현재 체력: ${player.hp}/${player.maxHp}`,
      ),
    );

    updateAchievements(player); // 스테이지 클리어 후 업적 갱신
    await stageClearOptions(stage, player, logs);
    logs.length = 0;
  } else if (player.hp <= 0) {
    console.log(chalk.red(`플레이어가 쓰러졌습니다. 게임 오버!`));
  }
};

const weapons = [
  new Weapon('BF소드', 10, false, 50),
  new Weapon('흡혈의 낫', 20, true, 100),
  new Weapon('몰락한 왕의 검', 30, true, 200),
];

const stageClearOptions = async (stage, player, logs) => {
  console.log(chalk.magentaBright(`\n스테이지 ${stage} 클리어!`));
  console.log(chalk.green(`1. 랜덤 공격력 증가`));
  console.log(chalk.yellow(`2. 랜덤 체력 회복`));
  console.log(chalk.blue(`3. 상점 방문 (골드: ${player.gold})`));
  console.log(chalk.red(`4. 게임 종료`));

  const choice = readlineSync.question('옵션을 선택하세요: ');

  const availableWeapons = weapons.filter((weapon) => weapon !== player.weapon);

  switch (choice) {
    case '1': {
      const increaseAmount = Math.floor(Math.random() * 10) + 5;
      player.attackPower += increaseAmount;
      console.log(
        chalk.green(
          `플레이어의 공격력이 ${increaseAmount}만큼 증가했습니다. 현재 공격력: ${player.attackPower}`,
        ),
      );
      break;
    }
    case '2': {
      const healAmount = Math.floor(Math.random() * 20) + 10;
      player.hp += healAmount;
      console.log(chalk.green(`플레이어가 ${healAmount}만큼 체력을 회복했습니다.`));
      break;
    }
    case '3': {
      if (availableWeapons.length === 0) {
        console.log(chalk.yellow('상점에 구매 가능한 무기가 없습니다.'));
        break;
      }

      let inShop = true;
      while (inShop) {
        console.log(chalk.blueBright('\n상점에서 구매할 수 있는 무기 목록:'));
        availableWeapons.forEach((weapon, index) => {
          console.log(
            chalk.green(
              `${index + 1}. ${weapon.name} - 공격력 +${weapon.attackBonus}, 가격: ${weapon.price} 골드`,
            ),
          );
        });
        console.log(chalk.red(`0. 상점 나가기`)); // 상점 나가기 옵션 추가

        const weaponChoice = readlineSync.question('구입할 무기 번호를 선택하세요: ');

        if (weaponChoice === '0') {
          inShop = false; // 상점 나가기
          console.log(chalk.yellow('상점을 나갑니다.'));
        } else {
          const weaponIndex = parseInt(weaponChoice) - 1;
          const weapon = availableWeapons[parseInt(weaponChoice) - 1];

          if (weapon) {
            const purchased = player.buyWeapon(weapon);
            if (purchased) {
              inShop = false; // 무기 구매 성공 시 상점 나가기
            } else {
              console.log(chalk.red('골드가 부족합니다. 다른 무기를 선택하거나 상점을 나가세요.'));
            }
          } else {
            console.log(chalk.red('잘못된 선택입니다. 다시 선택해주세요.'));
          }
        }
      }
      break;
    }
    case '4':
      console.log(chalk.red('게임이 종료되었습니다.'));
      process.exit();
      break;
    default:
      console.log(chalk.red('잘못된 선택입니다. 다시 선택해 주세요.'));
      await stageClearOptions(stage, player, logs);
      break;
  }
};

function updateAchievements(player) {
  // 첫 번째 게임 시작 업적
  if (!achievements[0].achieved) {
    achievements[0].achieved = true;
    console.log(chalk.green('첫 번째 게임 시작 업적을 달성했습니다!'));
  }

  // 100골드 획득 업적
  if (player.gold >= 100 && !achievements[1].achieved) {
    achievements[1].achieved = true;
    console.log(chalk.green('100골드 획득 업적을 달성했습니다!'));
  }

  // 첫 번째 무기 구매 업적
  if (player.weapon && !achievements[2].achieved) {
    achievements[2].achieved = true;
    console.log(chalk.green('첫 번째 무기 구매 업적을 달성했습니다!'));
  }
}

export async function startGame() {
  console.clear();
  let stage = 1;
  const player = new Player(stage);
  let logs = []; // 로그 배열 초기화

  updateAchievements(player); // 첫 번째 게임 시작 업적 갱신

  while (stage <= 10 && player.hp > 0) {
    const monster = new Monster(stage); // 현재 스테이지에 맞는 몬스터 생성
    await battle(stage, player, monster, logs); // 전투 시작

    if (monster.hp <= 0) {
      console.log(chalk.green(`스테이지 ${stage} 클리어!`));
      stage++;
    } else if (player.hp <= 0) {
      console.log(chalk.red(`게임 오버!`));
      break;
    }

    logs = []; // 스테이지 종료 후 로그 초기화
  }

  if (stage > 10) {
    console.log(chalk.green('축하합니다! 모든 스테이지를 클리어했습니다.'));
  }

  console.clear();
  logs.forEach((log) => console.log(log)); // 마지막 로그 출력
}
