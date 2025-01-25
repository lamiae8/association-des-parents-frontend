import { AccountIdComponent } from './admin-account/account-id/account-id.component';
import { NgModule } from '@angular/core';
import { Routes,RouterModule  } from '@angular/router';
import { EventComponent } from './Evenement/VisuEvent/event/event.component';
import { CreateEventComponent } from './Evenement/create-event/create-event.component';
import { UpdateEventComponent } from './Evenement/update-event/update-event.component';
import {LoginComponent} from "./login/login.component";
import {InscriptionComponent} from "./inscription/inscription.component";
import {PasswordForgottenComponent} from "./password-forgotten/password-forgotten.component";
import {ResetPasswordComponent} from "./reset-password/reset-password.component";
import { AuthGuard } from './auth/auth.guard';
import {EventByIdComponent} from "./Evenement/event-by-id/event-by-id.component";
import {UserProfileComponent} from "./user-profile/user-profile.component";
import {AdulteCommandeComponent} from "./Commande/adulte-commande/adulte-commande.component";
import {ModifierCommandeComponent} from "./Commande/modifier-commande/modifier-commande.component";
import {AccountRoleUpdateComponent} from "./account-role-update/account-role-update.component";
import { CreateAdminComponent} from './admin-account/create-admin/create-admin.component';
import { AdminDetailsComponent } from './admin-account/admin-details/admin-details.component';
import {CreateCommandeComponent} from "./Commande/create-commande/create-commande.component";

export const routes: Routes = [

  {path: 'event', component: EventComponent,canActivate: [AuthGuard]},
  {path: 'event/create', component: CreateEventComponent,canActivate: [AuthGuard], data: { adminOnly: true } },
  {path: 'event/update', component: UpdateEventComponent,canActivate: [AuthGuard], data: { adminOnly: true } },
  {path: 'login', component: LoginComponent},
  {path: 'event/:id', component: EventByIdComponent, canActivate: [AuthGuard]},
  {path: 'inscription', component: InscriptionComponent},
  {path: 'password-forgotten', component: PasswordForgottenComponent },
  {path: 'reset-password/:token', component: ResetPasswordComponent },
  {path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  {path: 'mesCommandes',component: AdulteCommandeComponent, canActivate:[AuthGuard]},
  {path: 'modifier-commande/:id', component: ModifierCommandeComponent },
  {path: 'modifier-role', component: AccountRoleUpdateComponent,canActivate:[AuthGuard],data:{adminOnly: true}},
  {path: 'admin-details', component: AdminDetailsComponent, canActivate: [AuthGuard]},
  {path: 'admin-create', component: CreateAdminComponent, canActivate: [AuthGuard]},
  {path: 'account/:id', component: AccountIdComponent, canActivate: [AuthGuard]},
  {path: 'event/commande/:id', component: CreateCommandeComponent, canActivate: [AuthGuard]},
  {path: '**', redirectTo: 'event'}

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
