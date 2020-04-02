import { Component, OnInit } from '@angular/core';
import { CandidatesService } from 'src/app/services/candidates.service';
import { ToastController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { ActivatedRoute, Router } from '@angular/router';

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
    private toastCtrl: ToastController,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  public castingVote = false;
  public votesCasted = false;
  public totalEla: number = 1000;
  private votedEla: number = 0;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params) {
        this.totalEla = Math.floor(parseInt(params.elaamount) / 100000000);
        console.log('ELA Balance', this.totalEla);
      }
    });
  }

  ionViewWillEnter() {
    titleBarManager.setTitle('My Candidates');
    titleBarManager.setNavigationMode(TitleBarPlugin.TitleBarNavigationMode.BACK);
    titleBarManager.setBackgroundColor("#181d20");
  }

  ionViewDidEnter() {
    appManager.setVisible("show");
  }

  /****************** Cast Votes *******************/
  castVote() {
    let votedCandidates = [];
    let castedKeys = [];
    this.candidatesService.selectedCandidates.map((candidate) => {
      if(candidate.userVotes && candidate.userVotes > 0) {
        votedCandidates.push({
          // Modify for intent specifications
          id: candidate.cid,
          votes: candidate.userVotes
        });
        castedKeys.push(candidate.cid);
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

      appManager.sendIntent(
        'crvotingtransaction',
        { keys: (castedKeys) },
        {},
        (res) => {
          console.log('Insent sent sucessfully', res);
          this.castingVote = false;
          this.votesCasted = true;
          this.voteSuccessToast();
        }, (err) => {
          console.log('Intent sent failed', err);
          this.castingVote = false;
          this.voteFailedToast(err);
        }
      );
     /*  setTimeout(() => {
        console.log('Voted candidates ', + votedCandidates)
        this.castingVote = false;
        this.votesCasted = true;
      }, 4000); */
    }
  }

  /****************** Misc *******************/
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

  /****************** Toasts/Alerts *******************/
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

  async voteSuccessToast() {
    const toast = await this.toastCtrl.create({
      mode: 'ios',
      header: 'Voted successfully casted!',
      color: "primary",
      cssClass: 'toaster',
      buttons: [
        {
          text: 'Okay',
          handler: () => {
            toast.dismiss();
            this.router.navigate(['/candidates']);
          }
        }
      ]
    });
    toast.present();
  }

  async voteFailedToast(err: string) {
    const toast = await this.toastCtrl.create({
      mode: 'ios',
      header: 'There was an error with casting votes...',
      message: err,
      color: "primary",
      cssClass: 'toaster',
      buttons: [
        {
          text: 'Okay',
          handler: () => {
            toast.dismiss();
            this.router.navigate(['/candidates']);
          }
        }
      ]
    });
    toast.present();
  }
}
