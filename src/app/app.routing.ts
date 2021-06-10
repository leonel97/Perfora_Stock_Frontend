import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AppComponent} from "./app.component";

let routes: Routes = [
  {
    path: '', component: AppComponent,
    children: [
      {
        path: 'gestion',
        loadChildren: () => import('./gestion/gestion.module').then(g => g.GestionModule)
      },
      {
        path: '',
        loadChildren: () => import('./auth/auth.module').then(a => a.AuthModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
