import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

    set(key: string, value: string) {
        localStorage.setItem(key, value);
    }

    get(key: string) {
        return localStorage.getItem(key);
    }

    remove(key: string) {
        localStorage.removeItem(key);
    }

    isUserLog() {
        if (this.get('token')) {
          if (jwtDecode<any>(JSON.stringify(this.get('token'))).userId == this.get('userId')){
            console.log("icicicici");
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
    }
}
