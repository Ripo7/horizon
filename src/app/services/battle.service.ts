import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { arrayRemove, arrayUnion } from 'firebase/firestore';
@Injectable({
  providedIn: 'root'
})
export class BattleService {

  private dbPath = '/battle';

  battleRef: AngularFirestoreCollection<any>;

  constructor(private db: AngularFirestore) {
    this.battleRef = this.db.collection(this.dbPath);
  }

  getBattleRealTime() {
    return this.battleRef.snapshotChanges().pipe(
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
}
