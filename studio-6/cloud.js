// Firebase Web SDK. No administrative credentials belong in this client.
export async function connectCloud(config){
 if(!config||typeof config!=='object'||['apiKey','authDomain','projectId','storageBucket','appId'].some(k=>typeof config[k]!=='string'||!config[k]))throw Error('Firebase 웹 앱 설정 5개 항목을 확인하세요.');if(config.private_key||config.client_email)throw Error('서비스 계정 키는 사용할 수 없습니다.');
 const version='12.4.0',base=`https://www.gstatic.com/firebasejs/${version}/`,[appSDK,authSDK,dbSDK,storageSDK]=await Promise.all(['firebase-app.js','firebase-auth.js','firebase-firestore.js','firebase-storage.js'].map(path=>import(base+path)));
 const app=appSDK.getApps().find(a=>a.name==='fig-studio');if(app&&app.options.projectId!==config.projectId)throw Error('프로젝트를 바꾸려면 로그아웃 후 페이지를 새로고침하세요.');const instance=app||appSDK.initializeApp(config,'fig-studio'),auth=authSDK.getAuth(instance),result=await authSDK.signInWithPopup(auth,new authSDK.GoogleAuthProvider()),user=result.user,db=dbSDK.getFirestore(instance),storage=storageSDK.getStorage(instance),doc=dbSDK.doc(db,'users',user.uid,'workspaces','studio-6');let revision=null;
 return{email:user.email,async load(){const snap=await dbSDK.getDoc(doc);revision=snap.exists()?snap.data().revision:0;return snap.exists()?snap.data().state:null},async save(state){
  // A newly connected device must read before replacing an existing workspace.
  const before=await dbSDK.getDoc(doc);if(revision===null){if(before.exists())throw Error('클라우드에 기존 자료가 있습니다. 먼저 불러오기해 주세요.');revision=0}if((before.exists()?before.data().revision:0)!==revision)throw Error('다른 컴퓨터에서 변경되었습니다. 현재 설정을 파일로 백업한 뒤 클라우드를 불러오세요.');
  for(const[k,data]of Object.entries(state.images)){if(data.startsWith('data:')){const path=`users/${user.uid}/images/${crypto.randomUUID()}-${k}`,ref=storageSDK.ref(storage,path);await storageSDK.uploadString(ref,data,'data_url');state.images[k]=await storageSDK.getDownloadURL(ref)}}
  const next=revision+1;await dbSDK.runTransaction(db,async tx=>{const snap=await tx.get(doc),remote=snap.exists()?snap.data().revision:0;if(remote!==revision)throw Error('다른 컴퓨터에서 변경되었습니다. 먼저 클라우드를 불러오세요.');tx.set(doc,{revision:next,state,updatedAt:dbSDK.serverTimestamp()})});revision=next;
 },async logout(){await authSDK.signOut(auth)}}
}
