import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'Firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc, addDoc, collection, collectionData, query, updateDoc, deleteDoc} from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, uploadString, ref, getDownloadURL, deleteObject } from "firebase/storage";
import { get } from 'http';
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  storage = inject(AngularFireStorage);
  utilSvc = inject(UtilsService);

  // ====Autenticación======
  getAuth() {
    return getAuth();

  }


  //==Acceder===
  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);

  }

  //==Crear usuario===
  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);

  }

  //==Actualizar usuario===
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName })

  }

  //envio de email para restablecer contraseña

  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email)
  }

  //=== cerrar sesión
  signOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilSvc.routerLink('/auth')

  }


  //============Base de datossss =======


  //obtener documento de una colección ======
  getCollectionData(path: string, collectionQuery?: any) {
    const ref = collection(getFirestore(), path);
    return collectionData(query(ref, collectionQuery), {idField: 'id'});

  }





  //== setear documento
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

    //== Actualizar documento
    updateDocument(path: string, data: any) {
      return updateDoc(doc(getFirestore(), path), data);
    }

  
     //== Borrar documento
     deleteDocument(path: string) {
      return deleteDoc(doc(getFirestore(), path));
    }

  //obtener un documento 

  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  //== Agregar un documentoo ===
  addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data);
  }


  //=== Almacenamiento====

  //=== para subir imagenes ===
  async uploadImage(path: string, data_url: string) {
    return uploadString(ref(getStorage(), path), data_url, 'data_url').then(() => {

      return getDownloadURL(ref(getStorage(), path))
    })

  }

  // obtener ruta de la imagen con su url ---

  async getFilePath(url: string){
    return ref(getStorage(), url).fullPath

  }

  //eliminar archivo
  deleteFile(path: string){
    return deleteObject(ref(getStorage(), path))

  }


}
