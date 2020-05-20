import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Candidate } from '../models/candidates.model';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';
import { Platform, AlertController } from '@ionic/angular';
import { Selected } from '../models/selected.model';

declare let appManager: AppManagerPlugin.AppManager;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Injectable({
  providedIn: 'root'
})
export class CandidatesService {

  constructor(
    private platform: Platform,
    private http: HttpClient,
    private router: Router,
    private zone: NgZone,
    private alertCtrl: AlertController,
    private storageService: StorageService
  ) { }

  public candidates: Candidate[] = [];
  public totalVotes: number = 0;
  public selectedCandidates: Selected[] = [];

  init() {
    this.fetchCandidates();
    this.getSelectedCandidates();

    if (this.platform.platforms().indexOf("cordova") >= 0) {
      console.log("Listening to intent events");
      titleBarManager.setOnItemClickedListener((menuIcon)=>{
        switch (menuIcon.key) {
          case "back":
            this.router.navigate(['candidates']);
            break;
          case "registerApp":
            this.registerAppAlert();
            break;
        }
      });
      titleBarManager.setupMenuItems(
        [
          {
            key: "registerApp",
            iconPath: "/assets/images/register.png",
            title: "Register Capsule"
          }
        ],
      );
    }
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

  getSelectedCandidates() {
    this.storageService.getVotes().then(data => {
      console.log('Selected Candidates', data);
      if(data) {
        this.selectedCandidates = data;
      }
    });
  }

  fetchCandidates() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };

    const params = {
      "method": "listcrcandidates",
      "params": {"state": "active"}
    };

    console.log('Fetching Candidates..');
    this.http.post<any>('http://api.elastos.io:20336/', params, httpOptions).subscribe((res) => {
      console.log(res);
      this.candidates = res.result.crcandidatesinfo;
      this.totalVotes = parseFloat(res.result.totalvotes);
      this.getLogos();
    }, (err) => {
      console.error(err);
    });
  }

  getLogos() {
    this.candidates.map((can) => {
      if (can.nickname === 'Michael S') {
        can.imageUrl = '/assets/candidates/mikes.jpg';
        can.location = 'United States'
      }
      if (can.nickname === 'SunnyFengHan') {
        can.imageUrl = '/assets/candidates/SunnyFengHan.png';
        can.location = 'United States'
      }
      if (can.nickname === 'Orchard Trinity') {
        can.imageUrl = '/assets/candidates/orchard.png';
        can.location = 'United Kingdom'
      }
      if (can.nickname === 'The Strawberry Council') {
        can.location = 'United States'
        can.imageUrl = '/assets/candidates/strawberry.png';
      }
      if (can.nickname === 'Ela Cloud (亦来云盘）') {
        can.location = 'China'
      }
      if (can.nickname === 'dingning（丁宁）') {
        can.location = 'China'
        can.imageUrl = '/assets/candidates/dingning.png';
      }
      if (can.nickname === 'Tyro lee小黑狼') {
        can.location = 'China'
        can.imageUrl = '/assets/candidates/tyrolee.png';
      }
      if (can.nickname === 'zhangqing（张青）') {
        can.location = 'China'
      }
      if (can.nickname === 'ELADAO') {
        can.location = 'China'
      }
      if (can.nickname === 'Zhang Feng') {
        can.location = 'China'
        can.imageUrl = '/assets/candidates/zhangfeng.png';
      }
      if (can.nickname === 'Alex Shipp') {
        can.location = 'United States'
        can.imageUrl = '/assets/candidates/alexshipp.png';
      }
      if (can.nickname === 'CR Malaysia') {
        can.location = 'Malaysia'
      }
      if (can.nickname === 'Adem Bilican') {
        can.location = 'Switzerland'
        can.imageUrl = '/assets/candidates/adembilican.png';
      }
      if (can.nickname === 'Bitwork Council Committee') {
        can.location = 'Hong Kong'
        can.imageUrl = '/assets/candidates/bitwork.png';
      }
      if (can.nickname === '中文社区管理员团队') {
        can.location = 'China'
      }
      if (can.nickname === 'Anders Alm') {
        can.location = 'Norway'
        can.imageUrl = '/assets/candidates/andersalm.png';
      }
      if (can.nickname === 'ELAFISH') {
        can.location = 'Canada'
        can.imageUrl = '/assets/candidates/elafish.png';
      }
      if (can.nickname === 'CR Frigate') {
        can.location = 'Hong Kong'
      }
    });
  }

}
