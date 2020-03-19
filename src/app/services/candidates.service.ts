import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Candidate } from '../models/candidates.model';

@Injectable({
  providedIn: 'root'
})
export class CandidatesService {

  constructor(private http: HttpClient) { }

  public candidates: Candidate[] = [
    {
      code: '123456789',
      cid: 'iTgmaqaMpMj46MW3GCU2h7bPaytwuvQrV1',
      did: 'iTgmaqaMpMj46MW3GCU2h7bPaytwuvQrV2',
      nickname: 'Donald Trump',
      url: 'trump2020.com',
      location: 1,
      state: 'Active',
      votes: '0',
      registerheight: 1,
      cancelheight: 2,
      index: 3
    },
    {
      code: '123456789',
      cid: 'iTgmaqaMpMj46MW3GCU2h7bPaytwuvQrV2',
      did: 'iTgmaqaMpMj46MW3GCU2h7bPaytwuvQrV2',
      nickname: 'Bernie Sanders',
      url: 'berniesanders.com',
      location: 2,
      state: 'Active',
      votes: '125',
      registerheight: 1,
      cancelheight: 2,
      index: 3
    },
    {
      code: '123456789',
      cid: 'iTgmaqaMpMj46MW3GCU2h7bPaytwuvQrV3',
      did: 'iTgmaqaMpMj46MW3GCU2h7bPaytwuvQrV2',
      nickname: 'Chad Racelis',
      url: 'chadracelis.com',
      location: 3,
      state: 'Active',
      votes: '100',
      registerheight: 1,
      cancelheight: 2,
      index: 3
    },
    {
      code: '123456789',
      cid: 'iTgmaqaMpMj46MW3GCU2h7bPaytwuvQrV4',
      did: 'iTgmaqaMpMj46MW3GCU2h7bPaytwuvQrV2',
      nickname: 'Ben Piette',
      url: 'benpiette.com',
      location: 4,
      state: 'Active',
      votes: '333',
      registerheight: 1,
      cancelheight: 2,
      index: 3
    },
    {
      code: '123456789',
      cid: 'iTgmaqaMpMj46MW3GCU2h7bPaytwuvQrV5',
      did: 'iTgmaqaMpMj46MW3GCU2h7bPaytwuvQrV2',
      nickname: 'Famous Amos',
      url: 'famousamos.com',
      location: 5,
      state: 'Active',
      votes: '420',
      registerheight: 1,
      cancelheight: 2,
      index: 3
    },
    {
      code: '123456789',
      cid: 'iTgmaqaMpMj46MW3GCU2h7bPaytwuvQrV6',
      did: 'iTgmaqaMpMj46MW3GCU2h7bPaytwuvQrV2',
      nickname: 'Houston Mike',
      url: 'houstonmike.com',
      location: 6,
      state: 'Active',
      votes: '40',
      registerheight: 1,
      cancelheight: 2,
      index: 3
    },
    {
      code: '123456789',
      cid: 'iTgmaqaMpMj46MW3GCU2h7bPaytwuvQrV7',
      did: 'iTgmaqaMpMj46MW3GCU2h7bPaytwuvQrV2',
      nickname: 'Ron Chen',
      url: 'ronchen.com',
      location: 7,
      state: 'Active',
      votes: '10000',
      registerheight: 1,
      cancelheight: 2,
      index: 3
    },
    {
      code: '123456789',
      cid: 'iTgmaqaMpMj46MW3GCU2h7bPaytwuvQrV8',
      did: 'iTgmaqaMpMj46MW3GCU2h7bPaytwuvQrV2',
      nickname: 'Donnie Bullers',
      url: 'donniebullers.com',
      location: 8,
      state: 'Active',
      votes: '200',
      registerheight: 1,
      cancelheight: 2,
      index: 3
    },
    {
      code: '123456789',
      cid: 'iTgmaqaMpMj46MW3GCU2h7bPaytwuvQrV9',
      did: 'iTgmaqaMpMj46MW3GCU2h7bPaytwuvQrV2',
      nickname: 'Martin Knight',
      url: 'martinknight.com',
      location: 9,
      state: 'Active',
      votes: '155',
      registerheight: 1,
      cancelheight: 2,
      index: 3
    },
    {
      code: '123456789',
      cid: 'iTgmaqaMpMj46MW3GCU2h7bPaytwuvQrV10',
      did: 'iTgmaqaMpMj46MW3GCU2h7bPaytwuvQrV2',
      nickname: 'Clarence Liu',
      url: 'clarencelui.com',
      location: 10,
      state: 'Active',
      votes: '10',
      registerheight: 1,
      cancelheight: 2,
      index: 3
    },
  ];

  init() {
    this.fetchCandidates();
  }

/*   fetchCandidates() {
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
    this.http.post<any>('http://api.elastos.io:20336/', httpOptions, params).subscribe((res) => {
      console.log(res);
    });
  } */

/*   fetchCandidates() {
    const headers = new HttpHeaders();
    headers.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "method": "listcrcandidates",
      "params": { "state":"active" }
    });

    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: raw,
      redirect: 'follow'
    };


    this.http.post<any>("http://api.elastos.io:20336", requestOptions).subscribe((res) => {
      console.log(res);
    }, (err) => {
      console.error(err);
    });
  } */

/*   fetchCandidates() {
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

  fetchCandidates() {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
      })
    }

    const body = {
      "method": "listcrcandidates",
      "params": { "state":"active" }
    };

    this.http.post("http://api.elastos.io:20336", JSON.stringify(body), httpOptions).subscribe((res) => {
      console.log(res);
    }, (err) => {
      console.error(err);
    });
  }
}
