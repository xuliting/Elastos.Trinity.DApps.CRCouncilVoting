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
  public totalEla: number = 0;
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

  ionViewDidLeave() {
    this.castingVote = false;
    this.votesCasted = false;
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

    if(Object.keys(votedCandidates).length === 0) {
     this.toastErr('Please pledge some ELA to your candidates')
    } else if (this.votedEla > this.totalEla) {
      this.toastErr('You are not allowed to pledge more ELA than you own');
    } else {
      console.log(votedCandidates);
      this.storageService.setVotes(this.candidatesService.selectedCandidates);
      this.castingVote = true;
      this.votesCasted = false;

      setTimeout(() => {
        appManager.sendIntent(
          'crmembervote',
          { votes: votedCandidates },
          {},
          (res) => {
            this.zone.run(() => {
              if(res.result.txid === null ) {
                this.voteFailedToast('Vote processing was incomplete');
              } else {
                console.log('Insent sent sucessfully', res);
                this.castingVote = false;
                this.votesCasted = true;
                this.voteSuccessToast(res.result.txid);
              }
            });
          }, (err) => {
            this.zone.run(() => {
              console.log('Intent sent failed', err);
              this.castingVote = false;
              this.voteFailedToast(err);
            });
          }
        );
      }, 2000);
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
      position: 'middle',
      mode: 'ios',
      color: 'tertiary',
      cssClass: 'customToast',
      duration: 2000
    });
    toast.present();
  }

  async voteSuccessToast(txid: string) {
    const toast = await this.toastCtrl.create({
      mode: 'ios',
      position: 'middle',
      header: 'Voted successfully casted!',
      message: 'Txid:' + txid.slice(0,30) + '...',
      color: 'tertiary',
      cssClass: 'customToast',
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
      position: 'middle',
      header: 'There was an error with casting votes..',
      message: err,
      color: 'tertiary',
      cssClass: 'customToast',
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
}
