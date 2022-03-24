import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { arrayRemove, arrayUnion, where } from 'firebase/firestore';
import { FightService } from './fight.service';
@Injectable({
  providedIn: 'root'
})
export class BattleService {

  private dbPath = '/battle';

  battleRef: AngularFirestoreCollection<any>;

  constructor(private db: AngularFirestore, private fightService: FightService) {
    this.battleRef = this.db.collection(this.dbPath);
  }

  getBattleNotFinished() {
    return this.db.collection(this.dbPath, ref => ref.where("finished","==", false)).snapshotChanges().pipe(
      map(battle => {
        return battle.map(a => {
          let tmpBat = {
            id: a.payload.doc.id, 
            data: a.payload.doc.data()
          }
          return tmpBat;
        })
      })
    );
  }

  addToTeam(team: string, idToken: number) {
    if (team === 'elda') {
      return this.battleRef.doc('NQJjb88A0waTnB3inbGD').ref.update({ elda: arrayUnion(idToken)});
    } else {
      return this.battleRef.doc('NQJjb88A0waTnB3inbGD').ref.update({ demetos: arrayUnion(idToken)});
    }
  }

  remoteFromTeam(team: string, idToken: number) {
    if (team === 'elda') {
      return this.battleRef.doc('NQJjb88A0waTnB3inbGD').ref.update({ elda: arrayRemove(idToken)});
    } else {
      return this.battleRef.doc('NQJjb88A0waTnB3inbGD').ref.update({ demetos: arrayRemove(idToken)});    
    }
  }

  createBattle(battleName: string, troopers: any, team: string) {
    let tmpData;
    if (team === 'elda') {
      tmpData = {
        finished: false,
        locked: false,
        winner: '',
        name: battleName,
        elda: troopers,
        demetos: [],
        result: []
      }
    } else if (team === 'demetos') {
      tmpData = {
        finished: false,
        locked: false,
        winner: '',
        name: battleName,
        demetos: troopers,
        elda: [],
        result: []
      }
    }
    return this.battleRef.add(tmpData);
  }

  updateBattle(battle: any, elda: any, demetos: any) {
    if (elda.length === 10 && demetos.length === 10) {
      let eldaBeforeFight = [...elda];
      let demetosBeforeFight = [...demetos];
      let finishedBattle = this.fightService.fight(battle, elda, demetos);
      return this.setResult(battle, eldaBeforeFight, demetosBeforeFight, finishedBattle.result, finishedBattle.winner);
    } else {
      return this.battleRef.doc(battle.id).update({
        elda: elda,
        demetos: demetos
      })
    }
  }

  setResult(battle: any, elda: any, demetos: any, result: any, winnerBattle: any) {
    return this.battleRef.doc(battle.id).ref.update({ elda: elda, demetos: demetos, result: result, winner: winnerBattle, finished: true, locked: true });
  }
}
