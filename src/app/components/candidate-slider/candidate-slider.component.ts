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

  public displayedCandidates: Candidate[] = [];

  slideOpts = {
    initialSlide: 1,
    speed: 400,
    centeredSlides: true,
    slidesPerView: 1.2
  };

  constructor(public candidatesService: CandidatesService) { }

  ngOnInit() {
    this.displayedCandidates = this.candidatesService.candidates.slice(0, this.candidateIndex + 2);
    this.slideOpts.initialSlide = this.displayedCandidates.indexOf(this.candidate);
  }

  // Increment candidates array when sliding forward //
  loadNext() {
    // Find last candidate in displayed slides
    let lastCandidate: Candidate = this.displayedCandidates.slice(-1)[0];
    // Use last candidate to find next candidate
    let nextCandidateIndex: number = this.candidatesService.candidates.indexOf(lastCandidate) + 1;
    // If next candidate exists, push it to slide array
    if(this.candidatesService.candidates[nextCandidateIndex]) {
      this.displayedCandidates.push(this.candidatesService.candidates[nextCandidateIndex]);
    } else {
      return;
    }
    console.log('last Candidate', lastCandidate);
    console.log('next Candidate', this.candidatesService.candidates[nextCandidateIndex]);
  }

  getVotePercent(votes: string): string {
    const votePercent: number = parseFloat(votes) / this.candidatesService.totalVotes * 100;
    return votePercent.toFixed(2);
  }
}
