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
        if (this.get('address')) {
          return true;
        } else {
          return false;
        }
    }
}
