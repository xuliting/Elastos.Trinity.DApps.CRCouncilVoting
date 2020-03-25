import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage) {
  }

  public setVotes(value: any) {
    return this.storage.set("votes", JSON.stringify(value)).then((data) => {
      console.log('Stored votes', data)
    });
  }

  public getVotes(): Promise<any> {
    return this.storage.get("votes").then((data) => {
      console.log(data)
      return JSON.parse(data);
    });
  }
}
