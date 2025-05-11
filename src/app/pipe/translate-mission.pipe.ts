import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translateMission'
})
export class TranslateMissionPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;

    return value
      .replace(/Expedition/gi, 'Expedição')
      .replace(/Mission/gi, 'Missão');
  }

}
