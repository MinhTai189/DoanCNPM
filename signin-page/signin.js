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

const fireHref = firebase.database().ref('/taikhoan');
const userName = document.getElementById('userName');
const password = document.getElementById('password');
const formSubmit = document.getElementById('form-signin');
let isSignInSuccess = false;
let accountSigned;

fireHref.on('value', (snap) => {
    var data = snap.val();
    formSubmit.addEventListener('submit', (e) => {
        e.preventDefault();
        Object.entries(data).forEach(item => {
            if (item[1].taikhoan === userName.value && item[1].matkhau === password.value) {
                isSignInSuccess = true;
                accountSigned = {
                    taikhoan: item[1].taikhoan,
                    quyen: item[1].quyen
                }
            }
        })
        if (isSignInSuccess) {
            alert('Đã đăng nhập thành công!');
            sessionStorage.setItem('taikhoan', JSON.stringify(accountSigned));
            userName.value = '';
            password.value = '';
            location.replace('../tour-manage-page/infor.html');
        }
        else {
            alert('Tài khoản hoặc mật khẩu không chính xác!');
        }
    })
})