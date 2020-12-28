// ===============nếu vào trang mà chưa đăng nhập sẽ quay về trang đăng nhập===========
if (!sessionStorage.getItem('taikhoan'))
    location.replace('../signin-page/index.html');

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
const reservedTour = firebase.database().ref("/tourDaDangKy");
const gridContainer = document.querySelector('.grid-container');

reservedTour.on('value', snap => {
    const data = snap.val();
    let itemString = "";

    Object.entries(data).forEach((item, index) => {
        const {
            chiphi,
            diachi,
            email,
            hoten,
            huongdanvien1,
            huongdanvien2,
            ngaykhoihanh,
            ngayquayve,
            sdt,
            songuoi,
            taixe,
            tuyen
        } = item[1];

        itemString += `<div class="item item-${index + 1}"><div class="left"><div class="img"> 
        <img src="icon.png" alt="image" /></div><button class="edit-btn" onclick="editOnClick(${index + 1})"><i class="fas fa-edit"></i>Sửa</button> 
        <button onclick="removeOnClick('${item[0]}')"><i class="fas fa-eraser"></i> Xóa </button>
        <button class="save-btn" onclick="saveOnClick('${item[0]}', '${index + 1}')"><i class="fas fa-save"></i> Lưu </button>
        </div> <div class="right"> 
        <form action=""> <div class="input"> <label for="name"> <i class="fas fa-user-tie"></i></label> 
        <input type="text" name="name" class="name" value="${hoten}" /></div> <div class="input"> 
        <label for="addr"> <i class="fas fa-map-marker-alt"></i> </label> 
        <input type="text" name="addr" class="addr" value="${diachi}"/> </div> 
        <div class="input"> <label for="email"> <i class="fas fa-envelope"></i> </label> 
        <input type="text" name="email" class="email" value="${email}"/> </div> 
        <div class="input"> <label for="tel"> <i class="fas fa-phone-square-alt"></i> </label> 
        <input type="text" name="tel" class="tel" value="${sdt}"/> </div> <div class="info"> 
        <label for=""> <i class="far fa-bookmark"></i> </label> ${tuyen} </div> 
        <div class="info"> <label for=""> <i class="far fa-calendar-alt"></i> 
        </label> ${ngaykhoihanh} </div> <div class="info"> <label for=""> 
        <i class="far fa-calendar-alt"></i> </label> ${ngayquayve} </div> 
        <div class="info"> <label for=""> <i class="fas fa-car"></i> </label> ${taixe} </div> 
        <div class="info"> <label for=""> <i class="fas fa-chair"></i> </label> ${songuoi} ghế </div> 
        <div class="input"> <label for="tour-guide-1"> <i class="fas fa-male"></i> </label> 
        <input type="text" name="tour-guide-1" class="tour-guide-1" value="${huongdanvien1}"/> </div> <div class="input">
        <label for="tour-guide-2"> <i class="fas fa-male"></i> </label> 
        <input type="text" name="tour-guide-2" class="tour-guide-2" value="${huongdanvien2}"/> </div> 
        <div class="info"> <label for=""> <i class="fas fa-money-check"></i> </label> ${chiphi} </div> 
        </form> </div> </div>`
    })
    gridContainer.innerHTML = itemString; //gán element vào thẻ grid-containr
})

// ===========xử lý sự kiện khi ấn vào nút sửa================
const editOnClick = (position) => {
    const className = `.item-${position}`;
    const item = document.querySelector(className);
    const editBtn = item.querySelector('.edit-btn');
    const saveBtn = item.querySelector('.save-btn');

    resetElement(); // reset css trước khi áp dụng css cho các elemetn

    item.querySelectorAll('input').forEach(elememt => {
        elememt.style.background = '#fff';
        elememt.style.pointerEvents = 'visible';
    })
    // =======làm mờ nút edit, hiển thị nút save
    editBtn.style.opacity = '0.5';
    editBtn.style.pointerEvents = 'none';
    saveBtn.style.visibility = 'visible';
}

// ===================xử lý sự kiện khi ấn vào nút xóa============
const removeOnClick = (id) => {
    const remove = firebase.database().ref('/tourDaDangKy/' + id);
    remove.set(null) //xóa dữ liệu trong csdl
        .then(() => alert('Đã xóa thành công!'));
}

// ================xử lý sự kiện khi ấn vào nút lưu=================
const saveOnClick = (id, position) => {
    const className = `.item-${position}`;
    const temp = firebase.database().ref('/tourDaDangKy/' + id);
    const inputs = document.querySelector(className).querySelectorAll('input');

    temp.once('value').then(snap => {
        let data = { ...snap.val() };

        //lấy giá trị từng thẻ input
        inputs.forEach((input, index) => {
            data[convertIndex(index)] = input.value;
        })

        temp.set(data).then(() => resetElement()); //set lại dữ liệu trong csdl sau khi lưu
    })
}

// ===============reset css của element về ban đầu============
const resetElement = () => {
    const saveBtns = document.querySelectorAll('.save-btn');
    const editBtns = document.querySelectorAll('.edit-btn');
    const inputs = document.querySelectorAll('input');

    editBtns.forEach(editBtn => {
        editBtn.style.opacity = '1';
        editBtn.style.pointerEvents = 'visible';
    })

    saveBtns.forEach(saveBtn => {
        saveBtn.style.visibility = 'hidden';
    })

    inputs.forEach(input => {
        input.style.background = 'transparent';
        input.style.pointerEvents = 'none';
    })
}

// =============chuyển đổi vị trí input thành thuộc tính của đối tượng==========
const convertIndex = (index) => {
    switch (index) {
        case 0:
            return 'hoten'
        case 1:
            return 'diachi'
        case 2:
            return 'email'
        case 3:
            return 'sdt'
        case 4:
            return 'huongdanvien1'
        case 5:
            return 'huongdanvien2'
    }
}

//============= lấy thông tin tài khoản đã đăng nhập=============
const account = JSON.parse(sessionStorage.getItem('taikhoan'));
const userName = document.querySelector('.user-name');
const accountManage = document.getElementById('account-manage');
const signOutBtn = document.querySelector('.signout-btn');

// ===============nếu vào trang mà chưa đăng nhập sẽ quay về trang đăng nhập===========
if (!sessionStorage.getItem('taikhoan'))
    location.replace('../signin-page/index.html');
else {
    userName.innerHTML = account.taikhoan;
    if (account.quyen === "staff")
        accountManage.style.display = 'none';

    // ===========xử lý nút đăng xuất==================
    signOutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('taikhoan');
        location.replace('../signin-page/index.html');
    })
}