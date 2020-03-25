import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { CandidatesService } from 'src/app/services/candidates.service';
import { Candidate } from 'src/app/models/candidates.model';
import { Router } from '@angular/router';

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
    private toastCtrl: ToastController
  ) { }

  public candidate: Candidate
  public showCandidate = false;
  public candidateIndex: number;

  ngOnInit() {
  }

  ionViewWillEnter() {
    titleBarManager.setTitle('Candidates');
    titleBarManager.setNavigationMode(TitleBarPlugin.TitleBarNavigationMode.HOME);
    titleBarManager.setBackgroundColor("#181d20");
  }

  ionViewDidEnter() {
    appManager.setVisible("show");
  }

  addCandidate(candidate: Candidate) {
    let targetCandidate = this.candidatesService.selectedCandidates.find((_candidate) => _candidate.cid === candidate.cid);
    if (!targetCandidate) {
      this.candidatesService.selectedCandidates.push(candidate);
    } else {
      this.candidatesService.selectedCandidates = this.candidatesService.selectedCandidates.filter((_candidate) => _candidate.cid !== candidate.cid);
    }
    console.log('Selected candidates', this.candidatesService.selectedCandidates);
  }

  addCandidates() {
    console.log('Candidates', this.candidatesService.selectedCandidates);
    this.router.navigate(['/vote']);
  }

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

  _showCandidate(index: number, can: Candidate) {
    this.showCandidate = !this.showCandidate;
    this.candidateIndex = index;
    this.candidate = can;
  }
}
