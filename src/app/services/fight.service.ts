import { Injectable } from '@angular/core';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FightService {

  currentBattle: any;

  elda: any[] = [];

  demetos: any[] = [];

  demetosScore: any[] = [];

  eldaScore: any[] = [];

  eldaPoint = 0;

  demetosPoint = 0;

  winnerFight: any = null;

  winnerBattle: any = null;
  demetosTroop: any = null;
  
  result: any[] = [];

  eldaTroop: any = null;

  private dbPath = '/troopers';

  constructor() { }

  randomNumber(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  fight(battle: any, elda: any, demetos: any) {
    let battleFinish = false;
    let eldaSpePoint = 0;
    let demetosSpePoint = 0;
    while(!battleFinish) {
      let turnTo = null;
      if (!this.demetosTroop) {
        let randomIndexDemetos = Math.round(this.randomNumber(0, demetos.length - 1));
        this.demetosTroop = demetos[randomIndexDemetos];
        demetosSpePoint = 0;
      }
      if (!this.eldaTroop) {
        let randomIndexElda = Math.round(this.randomNumber(0, elda.length - 1));
        this.eldaTroop = elda[randomIndexElda];
        eldaSpePoint = 0;
      }
      
      let fightFinish = false;
      while(!fightFinish) {
        if (this.demetosTroop?.hp > 0 && this.eldaTroop?.hp > 0) {
          if (this.demetosTroop.speed < this.eldaTroop.speed) {
            let damageDemetos =  this.calculateTroopDamage(this.eldaTroop, this.demetosTroop);
            this.demetosTroop.hp = this.demetosTroop.hp - damageDemetos;
            this.result.push({
                type: 'attack',
                attacker: 'Elda',
                text: `Trooper #${this.eldaTroop.idToken} (${this.eldaTroop.hp} HP) deals ${damageDemetos} to Trooper #${this.demetosTroop.idToken} (${this.demetosTroop.hp} HP)`
              } 
            );
            if (this.demetosTroop.hp <= 0) {
              fightFinish = true;
              this.result.push({
                type: 'info',
                killed: 'Demetos',
                text: `Trooper #${this.demetosTroop.idToken} is killed by Trooper #${this.eldaTroop.idToken}`
              });
            } else {
              let damageElda = this.calculateTroopDamage(this.demetosTroop, this.eldaTroop);
              this.eldaTroop.hp = this.eldaTroop.hp - damageElda;
              this.result.push({
                  type: 'attack',
                  attacker: 'Demetos',
                  text: `Trooper #${this.demetosTroop.idToken} (${this.demetosTroop.hp} HP) deals ${damageElda} to Trooper #${this.eldaTroop.idToken} (${this.eldaTroop.hp} HP)`
                }
              );
              if (this.eldaTroop.hp <= 0) {
                fightFinish = true;
                this.result.push({
                  type: 'info',
                  killed: 'Elda',
                  text: `Trooper #${this.eldaTroop.idToken} is killed by Trooper #${this.demetosTroop.idToken}`
                });
              }
            }
          } else {
            let damageElda =  this.calculateTroopDamage(this.demetosTroop, this.eldaTroop);
              this.eldaTroop.hp = this.eldaTroop.hp - damageElda;
              this.result.push({
                  type: 'attack',
                  attacker: 'Demetos',
                  text: `Trooper #${this.demetosTroop.idToken} (${this.demetosTroop.hp} HP) deals ${damageElda} to Trooper #${this.eldaTroop.idToken} (${this.eldaTroop.hp} HP)`
                });
              if (this.eldaTroop.hp <= 0) {
                fightFinish = true;
                this.result.push({
                  type: 'info',
                  killed: 'Elda',
                  text: `Trooper #${this.eldaTroop.idToken} is killed by Trooper #${this.demetosTroop.idToken}`
                });
              } else {
                let damageDemetos =  this.calculateTroopDamage(this.eldaTroop, this.demetosTroop);
                this.demetosTroop.hp = this.demetosTroop.hp - damageDemetos;
                this.result.push({
                  type: 'attack',
                  attacker: 'Elda',
                  text: `Trooper #${this.eldaTroop.idToken} (${this.eldaTroop.hp} HP) deals ${damageDemetos} to Trooper #${this.demetosTroop.idToken} (${this.demetosTroop.hp} HP)`
                });
                if (this.demetosTroop.hp <= 0) {
                  this.result.push({
                    type: 'info',
                    killed: 'Demetos',
                    text: `Trooper #${this.demetosTroop.idToken} is killed by Trooper #${this.eldaTroop.idToken}`
                  });
                  fightFinish = true;
                }
              }
          }
        } else {
          fightFinish = true;
        }
      }
      if (this.demetosTroop.hp <= 0) {
        const indexTroop = demetos.findIndex((el: any) => el.token_id === this.demetosTroop.token_id);
        demetos.splice(indexTroop, 1);
        this.demetosTroop = null;
        if (demetos.length === 0) {
          this.winnerBattle = 'Elda';
          battleFinish = true;
        }
      }
      if (this.eldaTroop.hp <= 0) {
        const indexTroop = elda.findIndex((el: any) => el.token_id === this.eldaTroop.token_id);
        elda.splice(indexTroop, 1);
        this.eldaTroop = null;
        if (elda.length === 0) {
          this.winnerBattle = 'Demetos';
          battleFinish = true;
        }
      }
    }
    this.result.push(`Winner: ${this.winnerBattle}`);
    return { result: this.result, winner: this.winnerBattle};
 // }
}

calculateTroopDamage(attTroop: any, defTroop: any) {
  let finalAttack = attTroop.attack;
  finalAttack = finalAttack + (finalAttack * attTroop.precision / 100);
  let isCritical = this.randomNumber(0, 100) < attTroop.critical;
  if (isCritical) {
    finalAttack = finalAttack * 2;
  }
  finalAttack = finalAttack - (finalAttack * defTroop.armorScore / 100);
  return finalAttack;
}
}
