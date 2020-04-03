import { Component, OnInit, NgZone } from '@angular/core';
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
    private route: ActivatedRoute,
    private zone: NgZone
  ) { }

  public castingVote = false;
  public votesCasted = false;
  public totalEla: number = 1000;
  private votedEla: number = 0;

  ngOnInit() {
    console.log('My Candidates', this.candidatesService.selectedCandidates);
    this.route.queryParams.subscribe(params => {
      if (params) {
        this.totalEla = Math.floor(parseInt(params.elaamount) / 100000000);
        console.log('ELA Balance', this.totalEla);
      }
    });
  }

  ionViewWillEnter() {
    titleBarManager.setTitle('My Candidates');
    titleBarManager.setNavigationMode(TitleBarPlugin.TitleBarNavigationMode.CLOSE);
    titleBarManager.setBackgroundColor("#181d20");
  }

  ionViewDidEnter() {
    appManager.setVisible("show");
  }

  /****************** Cast Votes *******************/
  castVote() {
    let votedCandidates = {};
    this.candidatesService.selectedCandidates.map((candidate) => {
      if(candidate.userVotes && candidate.userVotes > 0) {
        let _candidate = { [candidate.cid] : candidate.userVotes.toString() }
        votedCandidates = { ...votedCandidates, ..._candidate }
      }
    });

    if(!votedCandidates) {
     this.toastErr('Please pledge some ELA to your candidates')
    } else if (this.votedEla > this.totalEla) {
      this.toastErr('You are not allowed to pledge more ELA than you own');
    } else {
      console.log(votedCandidates);
      this.storageService.setVotes(this.candidatesService.selectedCandidates);
      this.castingVote = true;
      this.votesCasted = false;

      appManager.sendIntent(
        'crmembervote',
        { votes: votedCandidates },
        {},
        (res) => {
          this.zone.run(() => {
            console.log('Insent sent sucessfully', res);
            this.castingVote = false;
            this.votesCasted = true;
            this.voteSuccessToast(res.result.txid);
          });
        }, (err) => {
          this.zone.run(() => {
            console.log('Intent sent failed', err);
            this.castingVote = false;
            this.voteFailedToast(err);
          });
        }
      );
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
  async toastErr(msg: string) {
    const toast = await this.toastCtrl.create({
      header: msg,
      position: 'top',
      mode: 'ios',
      color: 'primary',
      duration: 2000
    });
    toast.present();
  }

  async voteSuccessToast(txid: string) {
    const toast = await this.toastCtrl.create({
      mode: 'ios',
      position: 'top',
      header: 'Voted successfully casted!',
      message: txid,
      color: "primary",
      cssClass: 'toaster',
      buttons: [
        {
          text: 'Okay',
          handler: () => {
            toast.dismiss();
            appManager.close();
            // this.router.navigate(['/candidates']);
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
