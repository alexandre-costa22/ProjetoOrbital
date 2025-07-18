import { Component, OnInit, OnDestroy } from '@angular/core';
import { LiveService } from '../../services/live.service';
import { interval, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateStatusPipe } from '../../pipe/translate-status.pipe';

@Component({
  selector: 'app-orbital-live',
  templateUrl: './orbital-live.component.html',
  styleUrls: ['./orbital-live.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    // 2. Adicione o pipe aos imports do componente
    TranslateStatusPipe
  ]
})
export class OrbitalLiveComponent implements OnInit, OnDestroy {
  // ... o resto do seu código continua igual
  public upcomingLaunches: any[] = [];
  public isLoading: boolean = true;
  private timerSubscription: Subscription | undefined;

  constructor(private liveService: LiveService) {}

  ngOnInit(): void {
    this.liveService.getUpcomingLaunches().subscribe(
      (data) => {
        this.upcomingLaunches = data.map(launch => ({
          ...launch,
          countdown: { days: 0, hours: 0, minutes: 0, seconds: 0 },
          hasOccurred: false
        }));
        this.startTimers();
        this.isLoading = false;
      },
      (error) => {
        console.error('Erro ao buscar lançamentos:', error);
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  private startTimers(): void {
    this.timerSubscription = interval(1000).subscribe(() => {
      this.upcomingLaunches.forEach(launch => {
        this.updateCountdown(launch);
      });
    });
  }

  private updateCountdown(launch: any): void {
    if (!launch.net || launch.hasOccurred) return;

    const launchDate = new Date(launch.net).getTime();
    const now = new Date().getTime();
    const difference = launchDate - now;

    if (difference <= 0) {
      launch.hasOccurred = true;
    } else {
      launch.countdown.days = Math.floor(difference / (1000 * 60 * 60 * 24));
      launch.countdown.hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      launch.countdown.minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      launch.countdown.seconds = Math.floor((difference % (1000 * 60)) / 1000);
    }
  }
}
