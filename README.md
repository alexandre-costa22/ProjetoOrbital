# Orbital – Rastreador de Missões Espaciais

Projeto desenvolvido como parte do Trabalho de Conclusão de Curso do curso de Análise e Desenvolvimento de Sistemas no Centro Universitário Senac-RS.

Autores:  
- Alexandre Costa  
- Raul Silveira

---

## 🛰️ Resumo do Projeto

O acesso a informações sobre missões espaciais é atualmente fragmentado e pouco acessível, dificultando a experiência de estudantes, entusiastas e educadores. A ausência de uma plataforma centralizada e intuitiva representa uma lacuna importante para quem deseja acompanhar lançamentos, obter dados técnicos de foguetes ou seguir o status de missões espaciais.

Pensando nisso, propomos o *Orbital*: uma plataforma web que unifica e apresenta essas informações de forma acessível e interativa. O sistema fornece detalhes sobre lançamentos passados e futuros, contagens regressivas, dados técnicos e recursos de personalização.

Com isso, buscamos democratizar o acesso ao conhecimento aeroespacial e promover o engajamento de diversos públicos com a exploração espacial.

---

## 📌 Definição do Problema

Atualmente, informações sobre missões espaciais estão dispersas entre diferentes sites, APIs e redes sociais. Essa fragmentação gera dificuldades como:

- Acesso técnico restrito (APIs em inglês, uso de terminologia complexa);
- Falta de personalização e centralização de conteúdo relevante;
- Pouco suporte visual e interativo para o público geral.

Essa realidade desestimula o interesse de usuários não técnicos, e torna o tema menos acessível para educadores, criadores de conteúdo e estudantes.

Estudos apontam que a educação científica melhora significativamente com o uso de recursos visuais e interativos (WAZLAWICK, 2009), e o projeto Orbital visa justamente preencher essa lacuna, integrando APIs confiáveis como a da NASA e SpaceX em uma interface amigável.

---

## 🎯 Objetivos

### Objetivo Geral

Desenvolver uma aplicação web para centralizar e facilitar o acesso a informações sobre missões espaciais, tornando-as compreensíveis e interativas para o público geral.

### Objetivos Específicos

- Integrar APIs públicas (NASA e SpaceX) para exibir dados de missões espaciais;
- Permitir filtros por data, agência ou destino;
- Implementar contagem regressiva para lançamentos futuros;
- Permitir que usuários favoritem missões e recebam alertas personalizados;
- Criar uma interface acessível e responsiva para diferentes dispositivos.

---

## ⚙️ Stack Tecnológico

- *TypeScript*  
  Linguagem base do Angular, oferece tipagem estática e melhora a escalabilidade do projeto.  
  Referência: [TypeScript Docs](https://www.typescriptlang.org/)

- *Angular*  
  Framework para desenvolvimento de SPAs, com bom suporte a rotas, formulários, componentes reutilizáveis e integração com APIs REST.  
  Referência: [Angular Docs](https://angular.io/)

- *Firebase Authentication*  
  Solução da Google para autenticação de usuários via e-mail/senha, Google e outros provedores.  
  Referência: [Firebase Auth](https://firebase.google.com/products/auth)

- *NASA Open APIs & SpaceX API*  
  Fornecem dados públicos sobre eventos astronômicos, imagens e lançamentos espaciais.  
  Referência: [NASA APIs](https://api.nasa.gov/) | [SpaceX API](https://github.com/r-spacex/SpaceX-API)

- *Git + GitHub*  
  Controle de versão distribuído para gerenciar o código-fonte do projeto e colaboração entre membros.  
  Repositório: [https://github.com/seu-usuario/orbital](https://github.com/seu-usuario/orbital)

---

## 💡 Descrição da Solução

O *Orbital* é uma aplicação web que permite aos usuários navegar por missões espaciais passadas e futuras com informações detalhadas. A interface apresenta:

- Uma *home* com destaques de próximos lançamentos;
- Filtros por agência (NASA, SpaceX), missão e status;
- Contagem regressiva dinâmica para os lançamentos;
- Página de detalhes com informações sobre o foguete, carga e trajeto;
- Sistema de autenticação que permite favoritar missões e configurar notificações;
- Totalmente responsiva e com foco em acessibilidade.

O projeto foi construído com base nos princípios de usabilidade, usando cores contrastantes, tipografia legível e navegação clara, priorizando a experiência do usuário final.

---

## 🧱 Arquitetura

A arquitetura segue uma abordagem baseada em componentes e serviços, típica de aplicações Angular.


### Artefatos do Projeto

- [x] Personas e jornada do usuário  
- [x] Canvas de modelo de negócio  
- [x] Protótipo de interface no Figma  
- [x] Tabela comparativa com sistemas semelhantes  
- [x] Diagrama de casos de uso e entidades (ERD)

> Todos os artefatos estão disponíveis na pasta /docs do repositório.

---

## ✅ Validação

### Estratégia

A validação do sistema foi conduzida com base em feedbacks de usuários reais(ESTES SAO APENAS EXEMPLOS:

- Entrevistas com 3 professores de ciências e 5 estudantes de ensino médio;
- Testes de usabilidade com protótipos navegáveis no Figma;
- Questionário de satisfação com escala de 1 a 5.

### Consolidação dos Dados(ESTES SAO APENAS EXEMPLOS)

- 87,5% dos usuários consideraram a interface "intuitiva";
- 100% destacaram como positivo o recurso de contagem regressiva;
- Gráfico com resultados completo disponível em /docs/validacao-resultados.pdf.

---

## 📌 Conclusões

O projeto *Orbital* demonstrou ser uma solução viável para centralizar informações sobre missões espaciais e torná-las acessíveis a públicos diversos. Os objetivos foram atingidos, com feedback positivo dos usuários quanto à usabilidade e clareza das informações apresentadas.

### Limitações

- Dependência de disponibilidade e estabilidade das APIs externas;
- Funcionalidade de notificações ainda limitada no frontend.

### Perspectivas Futuras

- Expansão do sistema para abranger eventos astronômicos (chuvas de meteoros, eclipses);
- Criação de um aplicativo móvel com funcionalidades offline;
- Inclusão de gamificação e trilhas de aprendizado para jovens estudantes.

---

## 📚 Referências Bibliográficas(ESTES SAO APENAS EXEMPLOS)

- WAZLAWICK, Raul Sidnei. Metodologia de Pesquisa para Ciência da Computação. Rio de Janeiro: Elsevier, 2009.  
- NASA Open API. Disponível em: https://api.nasa.gov/  
- SpaceX REST API. Disponível em: https://github.com/r-spacex/SpaceX-API  
- Angular Documentation. Disponível em: https://angular.io/  
- Firebase Authentication. Disponível em: https://firebase.google.com/products/auth
