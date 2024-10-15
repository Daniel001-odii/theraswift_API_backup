// import * as admin from 'firebase-admin'
import dotenv from 'dotenv';
dotenv.config();

import admin from 'firebase-admin'

interface FirebaseConfig {
    projectId: string;
    privateKey: string;
    clientEmail: string;
}

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID as string,
        privateKey: (process.env.FIREBASE_PRIVATE_KEY as string).replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
    } as FirebaseConfig),
    storageBucket: `gs://${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
});

const bucket = admin.storage().bucket();

export { bucket };