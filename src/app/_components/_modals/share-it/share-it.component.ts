import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-share-it',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './share-it.component.html',
  styleUrls: ['./share-it.component.css']
})
export class ShareItComponent {
  @Input() link: string = window.location.href;
  @Output() closed = new EventEmitter<void>();

  copyLink() {
    navigator.clipboard.writeText(this.link).then(() => {
      alert('Link copiado para a área de transferência!');
    }).catch(() => {
      alert('Erro ao copiar o link.');
    });
  }

  close() {
    this.closed.emit();
  }

  get whatsappUrl() {
    return `https://wa.me/?text=${encodeURIComponent(this.link)}`;
  }

  get twitterUrl() {
    return `https://twitter.com/intent/tweet?url=${encodeURIComponent(this.link)}`;
  }

  get facebookUrl() {
    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.link)}`;
  }
}
