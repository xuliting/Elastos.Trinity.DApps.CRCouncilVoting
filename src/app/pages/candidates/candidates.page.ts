import { Component, OnInit, NgZone } from "@angular/core";
import { ToastController, AlertController } from "@ionic/angular";
import { CandidatesService } from "src/app/services/candidates.service";
import { Candidate } from "src/app/models/candidates.model";
import { Router, NavigationExtras } from "@angular/router";
import { StorageService } from "src/app/services/storage.service";

declare let appManager: AppManagerPlugin.AppManager;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Component({
  selector: "app-candidates",
  templateUrl: "./candidates.page.html",
  styleUrls: ["./candidates.page.scss"]
})
export class CandidatesPage implements OnInit {
  constructor(
    public candidatesService: CandidatesService,
    private storage: StorageService,
    private router: Router,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private zone: NgZone
  ) {}

  public candidate: Candidate;
  public showCandidate = false;
  public candidateIndex: number;
  public addingCandidates = false;

  ngOnInit() {
    this.showCandidate = false;
  }

  ionViewWillEnter() {
    this.addingCandidates = false;
    titleBarManager.setTitle("Candidates");
    titleBarManager.setNavigationMode(
      TitleBarPlugin.TitleBarNavigationMode.HOME
    );
    titleBarManager.setBackgroundColor("#181d20");
    titleBarManager.setupMenuItems(
      [
        {
          key: "registerApp",
          iconPath: "/assets/images/register.png",
          title: "Register Capsule"
        }
      ],
      this.askToRegister
    );
  }

  ionViewDidEnter() {
    appManager.setVisible("show");
  }

  ionViewDidLeave() {}

  askToRegister = () => {
    console.log("Menu item clicked");
    this.registerAppAlert();
  };

  /****************** Select Candidate *******************/
  addCandidate(candidate: Candidate) {
    let targetCandidate = this.candidatesService.selectedCandidates.find(
      _candidate => _candidate.cid === candidate.cid
    );
    if (!targetCandidate) {
      this.candidatesService.selectedCandidates.push({
        cid: candidate.cid,
        nickname: candidate.nickname,
        imageUrl: candidate.imageUrl,
        userVotes: 0
      });
    } else {
      this.candidatesService.selectedCandidates = this.candidatesService.selectedCandidates.filter(
        _candidate => _candidate.cid !== candidate.cid
      );
    }
    console.log(
      "Selected candidates",
      this.candidatesService.selectedCandidates
    );
  }

  /****************** Route to Vote *******************/
  addCandidates() {
    appManager.sendIntent(
      "walletaccess",
      { elaamount: { reason: "For CRC voting rights" } },
      {},
      res => {
        this.zone.run(() => {
          console.log(res);
          let props: NavigationExtras = {
            queryParams: {
              elaamount: res.result.walletinfo[0].elaamount
            }
          };
          console.log("Candidates", this.candidatesService.selectedCandidates);
          this.router.navigate(["/vote"], props);
        });
      },
      err => {
        console.log(err);
        this.toastWalletErr();
      }
    );
  }

  /****************** Modify Values *******************/
  candidateIsSelected(candidate: Candidate): Boolean {
    let targetCandidate = this.candidatesService.selectedCandidates.find(
      _candidate => _candidate.cid === candidate.cid
    );
    if (targetCandidate) {
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
      mode: "ios",
      position: "top",
      color: "primary",
      header: "Failed to fetch ELA balance",
      message: "ELA balance is needed to assess your voting rights"
    });
    toast.present();
  }

  async walletAlert() {
    const alert = await this.alertCtrl.create({
      mode: "ios",
      header: "Wallet Access Request",
      message:
        "Wallet will fetch your ELA balance to estimate your voting power",
      buttons: [
        {
          text: "Deny",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            console.log("No thanks");
          }
        },
        {
          text: "Continue",
          handler: () => {
            this.addCandidates();
            /* this.addingCandidates = true;
            setTimeout(() => {
              this.addCandidates();
            }, 1000); */
          }
        }
      ]
    });
    alert.present();
  }

  async registerAppAlert() {
    const alert = await this.alertCtrl.create({
      mode: "ios",
      header: "Would you like to add CRC Voting to your profile?",
      message:
        "Registering a capsule will allow your followers via Contacts to effortlessly browse your favorite capsules!",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            console.log("No thanks");
          }
        },
        {
          text: "Yes",
          handler: () => {
            appManager.sendIntent(
              "registerapplicationprofile",
              {
                identifier: "CRC Election",
                connectactiontitle: "Take part in the new Smart Web democracy!"
              },
              {}
            );
          }
        }
      ]
    });
    alert.present();
  }

  deleteStorage() {
    this.storage.setVotes([]);
  }
}
