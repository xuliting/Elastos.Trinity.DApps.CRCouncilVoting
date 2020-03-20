import { Component, OnInit } from '@angular/core';
import { CandidatesService } from 'src/app/services/candidates.service';
import { ToastController } from '@ionic/angular';

declare let appManager: AppManagerPlugin.AppManager;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Component({
  selector: 'app-vote',
  templateUrl: './vote.page.html',
  styleUrls: ['./vote.page.scss'],
})
export class VotePage implements OnInit {

  constructor(
    public candidatesService: CandidatesService,
    public toastCtrl: ToastController
  ) { }

  selectedCandidates: string[] = [];
  castingVote = false;

  ngOnInit() {
  }

  ionViewWillEnter() {
    titleBarManager.setTitle('Candidates');
    titleBarManager.setNavigationMode(TitleBarPlugin.TitleBarNavigationMode.HOME);
    // titleBarManager.setNavigationMode(TitleBarPlugin.TitleBarNavigationMode.BACK);
    titleBarManager.setBackgroundColor("#181d20");
  }

  ionViewDidEnter() {
    appManager.setVisible("show");
  }

  addCandidate(cid: string) {
    let targetId = this.selectedCandidates.find((id) => id === cid);
    if (!targetId) {
      this.selectedCandidates.push(cid);
    } else {
      this.selectedCandidates = this.selectedCandidates.filter((id) => id !== cid);
    }
    console.log('Selected candidates', this.selectedCandidates);
  }

  castVote() {
    if (this.selectedCandidates.length > 0) {
      this.castingVote = true;
      setTimeout(() => {
        this.castingVote = false;
      }, 2000);
    } else {
      this.noVotesToast();
    }
  }

  async noVotesToast() {
    const toast = await this.toastCtrl.create({
      header: 'You did not select any candidates!',
      position: 'top',
      mode: 'ios',
      color: 'success',
      duration: 2000
    });
    toast.present();
  }
}
