import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {AuthService} from "../services/common/auth.service";
import {LocalStoreService} from "../services/common/local-store.service";
import {IMenuItem, NavigationService} from "../services/common/navigation.service";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  nav: IMenuItem[];
  constructor(
    private router: Router,
    private auth: AuthService,
    private store: LocalStoreService,
    private navService: NavigationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // get the active nav
    this.navService.menuItems$.subscribe(items => {
      this.nav = items;
    });
    const token = this.store.getItem('access_token');
    if(token) {
      if(token!=null) {
        // if dealing with authencation only, just return true here ...
        let rep = false;

        // But if also dealing with authorization, check if user granted access for activeRoute
        const activeRoute = window.location.hash || window.location.pathname;
        const openRoutes: string[] = ['/', '/login', '/forgot-password', '/change-password'];
        if(openRoutes.indexOf(activeRoute.trim()) >=0) {
          rep = true;
        }
        // check if the activeRoute is include in authorized routes for the current user
        if(this.nav) {
          this.nav.forEach(item => {
            if (activeRoute.indexOf(item.state) !== -1) {
              rep = true; 
            }
          });
        }
        return rep;
      }
    }

    // not logged in so redirect to login page with the return url
    //this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
    //this.router.navigateByUrl('/');
    return false;
  }

}
