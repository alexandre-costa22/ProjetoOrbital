import { Pipe, PipeTransform } from '@angular/core';
import { Edital } from '../class/itemEditais';
@Pipe({
  name: 'filterEditais'
})
export class FilterEditaisPipe implements PipeTransform {
  transform(editais: Edital[], selectedBanca: string, query: string): Edital[] {
    if (!editais) return [];

    let filtered = editais;

    if (selectedBanca && selectedBanca !== 'Todas') {
      filtered = filtered.filter(edital =>
        edital.nome_banca.toLowerCase().includes(selectedBanca.toLowerCase())
      );
    }

    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(edital =>
        edital.titulo.toLowerCase().includes(lowerQuery) ||
        edital.descricao.toLowerCase().includes(lowerQuery) ||
        edital.nome_banca.toLowerCase().includes(lowerQuery)
      );
    }

    return filtered;
  }
}
