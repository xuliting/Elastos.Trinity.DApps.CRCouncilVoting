import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Candidate } from '../models/candidates.model';

@Injectable({
  providedIn: 'root'
})
export class CandidatesService {

  constructor(private http: HttpClient) { }

  public candidates: Candidate[] = [];
  public totalVotes: number = 0;

  init() {
    this.fetchCandidates();
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
    });
  }

/*
  fetchCandidates() {
    const headers = { "Content-Type": "application/json" }

    const body = {
      "method": "listcrcandidates",
      "params": { "state":"active" }
    };

    this.http.post("http://api.elastos.io:20336", body, { headers }).subscribe((res) => {
      console.log(res);
    }, (err) => {
      console.error(err);
    });
  } */
}
