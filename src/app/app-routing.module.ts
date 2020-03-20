import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

/* With bottom tabs */
/* const routes: Routes = [
  { path: '', loadChildren: './pages/menu/menu.module#MenuPageModule' }
]; */

/* Without bottom tabs */
const routes: Routes = [
  { path: 'menu/home', loadChildren: './pages/home/home.module#HomePageModule' },
  { path: 'menu/vote', loadChildren: './pages/vote/vote.module#VotePageModule' },
  { path: 'menu/history', loadChildren: './pages/history/history.module#HistoryPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
