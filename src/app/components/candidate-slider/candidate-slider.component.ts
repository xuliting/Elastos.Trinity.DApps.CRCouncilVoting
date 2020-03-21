import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { Candidate } from 'src/app/models/candidates.model';
import { CandidatesService } from 'src/app/services/candidates.service';

@Component({
  selector: 'app-candidate-slider',
  templateUrl: './candidate-slider.component.html',
  styleUrls: ['./candidate-slider.component.scss'],
})
export class CandidateSliderComponent implements OnInit {

  @ViewChild('slider', {static: false}) slider: IonSlides;

  @Input() candidate: Candidate;
  @Input() candidateIndex: number;

  public displayedArr: Candidate[] = [];

  slideOpts = {
    initialSlide: 1,
    speed: 400,
    centeredSlides: true,
    slidesPerView: 1.2
  };

  constructor(public candidatesService: CandidatesService) { }

  ngOnInit() {
    this.displayedArr = this.candidatesService.candidates.slice(0, this.candidateIndex + 2);
    this.slideOpts.initialSlide = this.displayedArr.indexOf(this.candidate);
  }

  // Increment candidates array when sliding forward //
  loadNext() {
    let lastCan: Candidate = this.displayedArr.slice(-1)[0];
    let nextCandidateIndex: number = this.candidatesService.candidates.indexOf(lastCan) + 1;
    if(nextCandidateIndex) {
      this.displayedArr.push(this.candidatesService.candidates[nextCandidateIndex]);
    }
    console.log('last Candidate', lastCan);
    console.log('next Candidate', this.candidatesService.candidates[nextCandidateIndex]);
  }

  getVotePercent(votes: string): string {
    const votePercent: number = parseFloat(votes) / this.candidatesService.totalVotes * 100;
    return votePercent.toFixed(2);
  }
}
