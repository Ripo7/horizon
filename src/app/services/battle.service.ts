import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { first, map } from 'rxjs/operators';
import { arrayRemove, arrayUnion, where } from 'firebase/firestore';
import { FightService } from './fight.service';
import { Moralis } from 'moralis';
@Injectable({
  providedIn: 'root'
})
export class BattleService {

  private dbPath = '/battles';

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

  createBattleOrc(battleName: string, orc: any, car: any) {
    let battleRef = this.db.collection('/battles');
    let tmpData = {
      name: battleName,
      player1: {user: Moralis.User.current()?.attributes.solAddress, orc: orc, car: car},
      player2: null,
      player3: null,
      player4: null,
      player5: null,
      numberAttender: 1,
      finished: false,
      started: false
    };
    return battleRef.add(tmpData);
  }

  getBattleToJoin() {
    return this.db.collection('/battles', ref => ref.where("finished","==", false) 
    && (
      ref.where("player1.user", "!=", Moralis.User.current()?.attributes.solAddress)
      || ref.where("player2.user", "!=", Moralis.User.current()?.attributes.solAddress)
      || ref.where("player3.user", "!=", Moralis.User.current()?.attributes.solAddress)
      || ref.where("player4.user", "!=", Moralis.User.current()?.attributes.solAddress)
      || ref.where("player5.user", "!=", Moralis.User.current()?.attributes.solAddress)
    ))
    .snapshotChanges().pipe(
      first(),
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

  getBattleJoined() {
    return this.db.collection('/battles', ref => 
      ref.where("player1.user", "==", Moralis.User.current()?.attributes.solAddress)
      || ref.where("player2.user", "==", Moralis.User.current()?.attributes.solAddress)
      || ref.where("player3.user", "==", Moralis.User.current()?.attributes.solAddress)
      || ref.where("player4.user", "==", Moralis.User.current()?.attributes.solAddress)
      || ref.where("player5.user", "==", Moralis.User.current()?.attributes.solAddress)
    )
    .snapshotChanges().pipe(
      first(),
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

  addPlayerToBattle(battle: any, orc: any, car: any, index: number) {
    console.log("tAAAA");
    let tmpData: any
    if (index === 0) {
      tmpData = {
        player1: {user: Moralis.User.current()?.attributes.solAddress, orc: orc, car: car},
        numberAttender: battle.data.numberAttender + 1
      }
    }
    if (index === 1) {
      tmpData = {
        player2: {user: Moralis.User.current()?.attributes.solAddress, orc: orc, car: car},
        numberAttender: battle.data.numberAttender + 1
      }
    }
    if (index === 2) {
      tmpData = {
        player3: {user: Moralis.User.current()?.attributes.solAddress, orc: orc, car: car},
        numberAttender: battle.data.numberAttender + 1
      }
    }
    if (index === 3) {
      tmpData = {
        player4: {user: Moralis.User.current()?.attributes.solAddress, orc: orc, car: car},
        numberAttender: battle.data.numberAttender + 1
      }
    }
    if (index === 4) {
      tmpData = {
        player5: {user: Moralis.User.current()?.attributes.solAddress, orc: orc, car: car},
        numberAttender: battle.data.numberAttender + 1
      }
    }
    return this.battleRef.doc(battle.id).update(tmpData);
  }
}