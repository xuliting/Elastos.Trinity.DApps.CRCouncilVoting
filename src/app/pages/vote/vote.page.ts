import { Component, OnInit } from '@angular/core';
import { CandidatesService } from 'src/app/services/candidates.service';
import { ToastController } from '@ionic/angular';
import { Candidate } from 'src/app/models/candidates.model';

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

  public selectedCandidates: string[] = [];
  public castingVote = false;
  public votesCasted = false;
  public candidate: Candidate
  public showCandidate = false;
  public candidateIndex: number;

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
    this.castingVote = false;
    this.votesCasted = false;

    if (this.selectedCandidates.length > 0) {
      this.castingVote = true;
      setTimeout(() => {
        this.castingVote = false;
        this.votesCasted = true;
      }, 4000);
    } else {
      this.noVotesToast();
    }
  }

  fixVotes(votes: string) {
    return parseInt(votes);
  }

  _showCandidate(index: number, can: Candidate) {
    this.showCandidate = !this.showCandidate;
    this.candidateIndex = index;
    this.candidate = can;
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
