import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translateStatus',
  standalone: true
})
export class TranslateStatusPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';

    const translations: { [key: string]: string } = {
      'Go for Launch': 'Pronto para Lançamento',
      'To Be Confirmed': 'A ser Confirmado',
      'To Be Determined': 'A ser Determinado',
      'Launch Successful': 'Lançamento com Sucesso',
      'Launch Failure': 'Falha no Lançamento',
      'On Hold': 'Em Espera',
      'In Flight': 'Em Voo',
      'Partial Failure': 'Falha Parcial',
      'Cancelled': 'Cancelado',
      'Scrubbed': 'Adiado'
    };

    return translations[value] || value;
  }
}
