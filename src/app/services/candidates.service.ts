import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Candidate } from '../models/candidates.model';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';

declare let appManager: AppManagerPlugin.AppManager;

@Injectable({
  providedIn: 'root'
})
export class CandidatesService {

  constructor(
    private platform: Platform,
    private http: HttpClient,
    private router: Router,
    private storageService: StorageService
  ) { }

  public candidates: Candidate[] = [];
  public totalVotes: number = 0;

  public selectedCandidates: Candidate[] = [];

  init() {
    this.fetchCandidates();
    this.getSelectedCandidates();

     if (this.platform.platforms().indexOf("cordova") >= 0) {
      console.log("Listening to intent events");
      appManager.setListener((msg) => {
        this.onMessageReceived(msg);
      });
    }
  }

  onMessageReceived(msg: AppManagerPlugin.ReceivedMessage) {
    if (msg.message === "navback") {
      this.router.navigate(['candidates']);
    }
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

      this.candidates.forEach((candidate) => {
        candidate.userVotes = 0
      });
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
      if (can.nickname === 'Orchard Trinity') {
        can.imageUrl = '/assets/candidates/orchard.png';
        can.location = 'United Kingdom'
      }
      if (can.nickname === 'The Strawberry Council') {
        can.location = 'United States'
      }
      if (can.nickname === 'Ela Cloud (亦来云盘）') {
        can.location = 'China'
      }
      if (can.nickname === 'dingning（丁宁）') {
        can.location = 'China'
      }
      if (can.nickname === 'Tyro lee小黑狼') {
        can.location = 'China'
      }
      if (can.nickname === 'zhangqing（张青）') {
        can.location = 'China'
      }
      if (can.nickname === 'ELADAO') {
        can.location = 'China'
      }
      if (can.nickname === 'Zhang Feng') {
        can.location = 'China'
      }
      if (can.nickname === 'Alex Shipp') {
        can.location = 'United States'
      }
      if (can.nickname === 'CR Malaysia') {
        can.location = 'Malaysia'
      }
      if (can.nickname === 'Adem Bilican') {
        can.location = 'Switzerland'
      }
      if (can.nickname === 'Bitwork Council Committee') {
        can.location = 'Hong Kong'
      }
      if (can.nickname === '中文社区管理员团队') {
        can.location = 'China'
      }
      if (can.nickname === 'Anders Alm') {
        can.location = 'Norway'
      }
      if (can.nickname === 'ELAFISH') {
        can.location = 'Canada'
      }
    });
  }

}
