import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {getAuth, provideAuth} from '@angular/fire/auth';
import {getFirestore, provideFirestore} from '@angular/fire/firestore';
import {getStorage, provideStorage} from '@angular/fire/storage';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp({
      "projectId": "villasportsanpedro-47e98",
      "appId": "1:147690172387:web:db3a4ed762d3c665007ad6",
      "storageBucket": "villasportsanpedro-47e98.firebasestorage.app",
      "apiKey": "AIzaSyBdr5wQcI7Jiy9fnZsigT_Pmn_nEFonGKM",
      "authDomain": "villasportsanpedro-47e98.firebaseapp.com",
      "messagingSenderId": "147690172387"
    })),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),

  ]
};
