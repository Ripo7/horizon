import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from './services/local-storage.service';
import { MoralisService } from './services/moralis.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private localStorage: LocalStorageService, private router: Router, private moralisService: MoralisService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this.moralisService.getUserLogged()) {
        return true 
      } else {
        this.router.navigate(['home']).then(() => {
          this.moralisService.loginSolana();
        })
        return false;
      }
  }
  
}
