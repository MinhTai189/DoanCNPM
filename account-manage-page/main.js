var firebaseConfig = {
  apiKey: "AIzaSyAtK92g4hEe7sKKUvum9H7_8cvREneFmqg",
  authDomain: "quanlydulich-483c9.firebaseapp.com",
  databaseURL: "https://quanlydulich-483c9.firebaseio.com",
  projectId: "quanlydulich-483c9",
  storageBucket: "quanlydulich-483c9.appspot.com",
  messagingSenderId: "907050619524",
  appId: "1:907050619524:web:0204d6c58a353563c368d1",
  measurementId: "G-JFJWQN9DTN"
};
firebase.initializeApp(firebaseConfig);

var fireHref = firebase.database().ref("/taikhoan");
let userName = [];

fireHref.on('value', (snapshot) => {
  let count = 0;
  document.getElementById('data').innerHTML = '<tr><th>STT</th><th>Tên tài khoản</th><th>Mật khẩu</th><th>Quyền</th><th>Chỉnh sửa</th></tr>';
  if (snapshot.val()) {
    let string = Object.entries(snapshot.val()).map((item) => {
      count++;
      userName.push(item[1].taikhoan);
      return `<tr><td>${count}</td><td>${item[1].taikhoan}</td><td>${item[1].matkhau}</td><td>${item[1].quyen}</td>
      <td><button class="btn edit" onclick="editAccount('${item[0]}','${item[1].taikhoan}', '${item[1].matkhau}', '${item[1].quyen}')">
      Sửa</button><button class="btn remove" onclick="removeAccount('${item[0]}')">Xóa</button></td></tr>`;
    })
    let temp = '<tr><th>STT</th><th>Tên tài khoản</th><th>Mật khẩu</th><th>Quyền</th><th>Chỉnh sửa</th></tr>';
    string.unshift(temp);
    document.getElementById('data').innerHTML = string.join('');
  }
});

// ============form insert==============
const insert = document.querySelector('#form-wrapper-insert');
const insertForm = document.querySelector("#insert-form");
const usernameInsert = document.querySelector('.username-insert');
const passwordInsert = document.querySelector('.password-insert');

const removeAccount = (id) => {
  firebase.database().ref("/taikhoan/" + id).remove();
}

const handleInsert = () => {
  insert.classList.toggle('active');
}

insertForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const usernameValue = document.querySelector('#username').value;
  const passwordValue = document.querySelector('#password').value;
  const permissionValue = document.querySelector('#permission').value;

  usernameInsert.setAttribute('data-wrong', '');
  passwordInsert.setAttribute('data-wrong', '');

  if (userName.includes(usernameValue)) {
    alert('Tài khoản đã tồn tại!');
    document.querySelector('#username').value = '';
    document.querySelector('#password').value = '';
  }
  else {
    if (!usernameValue || usernameValue.trim() === '')
      usernameInsert.setAttribute('data-wrong', 'Hãy nhập tài khoản!')

    if (!passwordValue || passwordValue.trim() === '')
      passwordInsert.setAttribute('data-wrong', 'Hãy nhập mật khẩu!');
    else {
      if (usernameValue || !(usernameValue.trim() === ''))
        var testData = {
          taikhoan: usernameValue,
          matkhau: passwordValue,
          quyen: permissionValue
        }
      const key = fireHref.push().key;
      var updates = {};
      updates['/taikhoan/' + key] = testData;
      firebase.database().ref().update(updates);
      alert('Đã thêm dữ liệu thành công!');
      document.querySelector('#username').value = '';
      document.querySelector('#password').value = '';
    }
  }
})
// =========form edit============
const edit = document.querySelector('#form-wrapper-edit');
const editForm = document.querySelector('#edit-form');
const usernameEdit = document.querySelector('.username-edit');
const passwordEdit = document.querySelector('.password-edit');
let idAccount = "";

const editAccount = (id, username, password, permission) => {
  document.querySelector('#editUsername').value = username;
  document.querySelector('#editPassword').value = password;
  document.querySelector('#editPermission').value = permission;
  edit.classList.toggle('active');
  idAccount = id;
}

editForm.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log('da ket noi');
  const usernameEditValue = document.querySelector('#editUsername').value;
  const passwordEditValue = document.querySelector('#editPassword').value;
  const permissionEditValue = document.querySelector('#editPermission').value;

  usernameEdit.setAttribute('data-wrong', '');
  passwordEdit.setAttribute('data-wrong', '');
  if (!usernameEditValue || usernameEditValue.trim() === '')
    usernameEdit.setAttribute('data-wrong', 'Hãy nhập tài khoản!')

  if (!passwordEditValue || passwordEditValue.trim() === '')
    passwordEdit.setAttribute('data-wrong', 'Hãy nhập mật khẩu!');
  else {
    firebase.database().ref('taikhoan/' + idAccount).set({
      taikhoan: usernameEditValue,
      matkhau: passwordEditValue,
      quyen: permissionEditValue
    });
    alert('Đã cập nhật thành công!');
    edit.classList.remove('active');
  }
})

//============= lấy thông tin tài khoản đã đăng nhập=============
const account = JSON.parse(sessionStorage.getItem('taikhoan'));
const userNameElement = document.querySelector('.user-name');
const accountManage = document.getElementById('account-manage');
const signOutBtn = document.querySelector('.signout-btn');

// ===============nếu vào trang mà chưa đăng nhập sẽ quay về trang đăng nhập===========
if (!sessionStorage.getItem('taikhoan'))
  location.replace('../signin-page/index.html');
else {
  userNameElement.innerHTML = account.taikhoan;
  if (account.quyen === "staff")
    accountManage.style.display = 'none';

  // ===========xử lý nút đăng xuất==================
  signOutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('taikhoan');
    location.replace('../signin-page/index.html');
  })
}
