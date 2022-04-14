import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AppComponent} from "./app.component";
import {AuthGaurd} from "./services/auth.gaurd";

let routes: Routes = [
  {
    path: '', component: AppComponent,
    children: [
      {
        path: 'gestion',
        loadChildren: () => import('./gestion/gestion.module').then(g => g.GestionModule),
        canActivate: [AuthGaurd]
      },
      {
        path: '',
        loadChildren: () => import('./auth/auth.module').then(a => a.AuthModule)
      },
    ]
  }
];

@NgModule({
  //imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
