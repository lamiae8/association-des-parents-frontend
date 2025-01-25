export * from './adulte.service';
import { AdulteService } from './adulte.service';
export * from './authentificationController.service';
import { AuthentificationControllerService } from './authentificationController.service';
export * from './commande.service';
import { CommandeService } from './commande.service';
export * from './evenement.service';
import { EvenementService } from './evenement.service';
export const APIS = [AdulteService, AuthentificationControllerService, CommandeService, EvenementService];
