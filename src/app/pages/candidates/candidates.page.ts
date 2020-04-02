import { Component, OnInit, NgZone } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { CandidatesService } from 'src/app/services/candidates.service';
import { Candidate } from 'src/app/models/candidates.model';
import { Router, NavigationExtras } from '@angular/router';

declare let appManager: AppManagerPlugin.AppManager;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Component({
  selector: 'app-candidates',
  templateUrl: './candidates.page.html',
  styleUrls: ['./candidates.page.scss'],
})
export class CandidatesPage implements OnInit {

  constructor(
    public candidatesService: CandidatesService,
    private router: Router,
    private toastCtrl: ToastController,
    private zone: NgZone
  ) { }

  public candidate: Candidate
  public showCandidate = false;
  public candidateIndex: number;

  ngOnInit() {
    this.showCandidate = false;
    this.candidatesService.candidates.forEach((can) => {
      can.userVotes = 0;
    });
  }

  ionViewWillEnter() {
    titleBarManager.setTitle('Candidates');
    titleBarManager.setNavigationMode(TitleBarPlugin.TitleBarNavigationMode.HOME);
    titleBarManager.setBackgroundColor("#181d20");
  }

  ionViewDidEnter() {
    appManager.setVisible("show");
  }

  /****************** Select Candidate *******************/
  addCandidate(candidate: Candidate) {
    let targetCandidate = this.candidatesService.selectedCandidates.find((_candidate) => _candidate.cid === candidate.cid);
    if (!targetCandidate) {
      this.candidatesService.selectedCandidates.push(candidate);
    } else {
      this.candidatesService.selectedCandidates = this.candidatesService.selectedCandidates.filter((_candidate) => _candidate.cid !== candidate.cid);
    }
    console.log('Selected candidates', this.candidatesService.selectedCandidates);
  }

  /****************** Route to Vote *******************/
  addCandidates() {
    appManager.sendIntent("walletaccess", {elaamount: {reason: 'For CRC voting rights'}}, {}, (res) => {
      this.zone.run(() => {
        console.log(res);
        let props: NavigationExtras = {
          queryParams: {
            elaamount: res.result.walletinfo[0].elaamount
          }
        }
        console.log('Candidates', this.candidatesService.selectedCandidates);
        this.router.navigate(['/vote'], props);
      });
    }, (err) => {
      console.log(err);
      this.toastWalletErr();
    });
  }

  /****************** Modify Values *******************/
  candidateIsSelected(candidate: Candidate): Boolean {
    let targetCandidate = this.candidatesService.selectedCandidates.find((_candidate) => _candidate.cid === candidate.cid);
    if(targetCandidate) {
      return true;
    } else {
      return false;
    }
  }

  fixVotes(votes: string) {
    return parseInt(votes);
  }

  /****************** Show Slide *******************/
  _showCandidate(index: number, can: Candidate) {
    this.showCandidate = !this.showCandidate;
    this.candidateIndex = index;
    this.candidate = can;
  }

  /****************** Toasts/Alerts *******************/
  async toastWalletErr() {
    const toast = await this.toastCtrl.create({
      mode: 'ios',
      position: 'top',
      color: 'primary',
      header: 'Failed to fetch ELA balance',
      message: 'ELA balance is needed to assess your voting rights'
    });
    toast.present();
  }
}
