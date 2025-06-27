const firebaseConfig = {
  apiKey: "AIzaSyCb2FAlbM5cdEEX62tVCOZzrbSY8_1lmvw",
  authDomain: "minipost2-6d97c.firebaseapp.com",
  projectId: "minipost2-6d97c",
  storageBucket: "minipost2-6d97c.appspot.com",
  messagingSenderId: "603858945719",
  appId: "1:603858945719:web:3c4e71acaf533427942f32",
  measurementId: "G-7V3ESPJEF5"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

const auth = firebase.auth();
const db = firebase.firestore();

const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const userNameSpan = document.getElementById('user-name');
const postForm = document.getElementById('post-form');
const postText = document.getElementById('post-text');
const postBtn = document.getElementById('post-btn');
const postsDiv = document.getElementById('posts');

loginBtn.onclick = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
};

logoutBtn.onclick = () => {
  auth.signOut();
};

auth.onAuthStateChanged(user => {
  if (user) {
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
    userNameSpan.textContent = `Olá, ${user.displayName}`;
    postForm.style.display = 'block';
    carregarPosts();
  } else {
    loginBtn.style.display = 'inline-block';
    logoutBtn.style.display = 'none';
    userNameSpan.textContent = '';
    postForm.style.display = 'none';
    postsDiv.innerHTML = '';
  }
});

postBtn.onclick = async () => {
  const texto = postText.value.trim();
  if (texto.length === 0) return alert("Digite algo para postar!");

  const user = auth.currentUser;
  if (!user) return alert("Você precisa estar logado!");

  await db.collection('posts').add({
    authorName: user.displayName,
    text: texto,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  postText.value = '';
};

function carregarPosts() {
  db.collection('posts')
    .orderBy('createdAt', 'desc')
    .onSnapshot(snapshot => {
      postsDiv.innerHTML = '';
      snapshot.forEach(doc => {
        const post = doc.data();
        const date = post.createdAt?.toDate().toLocaleString() || 'agora mesmo';
        postsDiv.innerHTML += `
          <div class="post">
            <div class="author">${post.authorName}</div>
            <div class="date">${date}</div>
            <div class="text">${post.text}</div>
          </div>
        `;
      });
    });
}
