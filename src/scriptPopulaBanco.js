import environment from '../environments/environments';

const admin = require('firebase-admin');

const serviceAccount = require(environment);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const dados = [
  { id: 'usuario1', nome: 'Carlos', idade: 30 },
  { id: 'usuario2', nome: 'Diana', idade: 25 }
];

async function popularFirestore() {
  const colecaoRef = db.collection('usuarios');

  console.log('Populando o Firestore...');
  for (const item of dados) {
    await colecaoRef.doc(item.id).set({
      nome: item.nome,
      idade: item.idade
    });
  }
  console.log('Firestore populado com sucesso!');
  process.exit(0);
}

popularFirestore().catch(error => {
  console.error('Erro ao popular o Firestore:', error);
  process.exit(1);
});