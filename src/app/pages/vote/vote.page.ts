import { Component, OnInit } from '@angular/core';
import { CandidatesService } from 'src/app/services/candidates.service';
import { ToastController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';

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
    private storageService: StorageService,
    private toastCtrl: ToastController
  ) { }

  public castingVote = false;
  public votesCasted = false;
  public totalEla: number = 1000;
  private votedEla: number = 0;

  ngOnInit() {
  }

  ionViewWillEnter() {
    titleBarManager.setTitle('My Candidates');
    titleBarManager.setNavigationMode(TitleBarPlugin.TitleBarNavigationMode.BACK);
    titleBarManager.setBackgroundColor("#181d20");
  }

  ionViewDidEnter() {
    appManager.setVisible("show");
  }

  castVote() {
    let votedCandidates = [];
    this.candidatesService.selectedCandidates.map((candidate) => {
      if(candidate.userVotes && candidate.userVotes > 0) {
        votedCandidates.push({
          // Modify for intent specifications
          id: candidate.cid,
          votes: candidate.userVotes
        });
      }
    });

    if(votedCandidates.length === 0) {
     this.toastErr('Please pledge some ELA to your candidates')
    } else if (this.votedEla > this.totalEla) {
      this.toastErr('You are not allowed to pledge more ELA than you own');
    } else {
      this.storageService.setVotes(this.candidatesService.selectedCandidates);
      this.castingVote = true;
      this.votesCasted = false;
      setTimeout(() => {
        console.log('Voted candidates ', + votedCandidates)
        this.castingVote = false;
        this.votesCasted = true;
      }, 4000);
    }
  }

  setInputDefault(event) {
    console.log(event);
  }

  getElaRemainder() {
    let votedEla = 0;
    this.candidatesService.selectedCandidates.map((can) => {
      votedEla += can.userVotes;
    });
    this.votedEla = votedEla;
    return this.totalEla - votedEla;
  }

  async toastErr(msg) {
    const toast = await this.toastCtrl.create({
      header: msg,
      position: 'top',
      mode: 'ios',
      color: 'primary',
      duration: 2000
    });
    toast.present();
  }
}
