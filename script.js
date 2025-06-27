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
const db = firebase.firestore();

let currentUserName = null;

const nameInput = document.getElementById('name-input');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const userInfo = document.getElementById('user-info');
const userNameSpan = document.getElementById('user-name');
const loginArea = document.getElementById('login-area');
const postForm = document.getElementById('post-form');
const postText = document.getElementById('post-text');
const postBtn = document.getElementById('post-btn');
const postsDiv = document.getElementById('posts');

loginBtn.onclick = () => {
  const name = nameInput.value.trim();
  if (name.length < 2) {
    alert("Digite um nome válido!");
    return;
  }
  currentUserName = name;
  userNameSpan.textContent = `Olá, ${currentUserName}`;
  loginArea.style.display = 'none';
  userInfo.style.display = 'flex';
  postForm.style.display = 'block';
  carregarPosts();
};

logoutBtn.onclick = () => {
  currentUserName = null;
  userInfo.style.display = 'none';
  loginArea.style.display = 'flex';
  postForm.style.display = 'none';
  postsDiv.innerHTML = '';
};

postBtn.onclick = async () => {
  const texto = postText.value.trim();
  if (!texto || !currentUserName) return;

  await db.collection('posts').add({
    authorName: currentUserName,
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
