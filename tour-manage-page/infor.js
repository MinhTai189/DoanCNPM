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

const data = firebase.database().ref("/taikhoan");
const tours = firebase.database().ref("/tours");
const tourDaDangKy = firebase.database().ref("/tourDaDangKy");

const khuvuc = document.getElementById('area');
const tuyen = document.getElementById('tours');
const thoigianTour = document.getElementById('time');
const ngayKhoiHanh = document.getElementById('date-start');
const ngayQuayVe = document.getElementById('date-return');
const soNguoi = document.getElementById('amount');


const form = document.getElementById('frm');
// ========  UTIL ==========
function doiTenMien(ten) {
    if (ten == 'mienbac') return 'Miền Bắc';
    if (ten == 'mientrung') return 'Miền Trung';
    if (ten == 'miennam') return 'Miền Nam';
    if (ten == 'Miền Bắc') return 'mienbac';
    if (ten == 'Miền Trung') return 'mientrung';
    if (ten == 'Miền Nam') return 'miennam';
}
function tongSoNgayDi(soNgay, soDem) {
    return soNgay.replace('N', ' Ngày ') + soDem.replace('D', ' Đêm');
}

function toMM_dd_yyyy(str) {
    let [ngay, thang, nam] = str.split('/');
    return `${thang}/${ngay}/${nam}`;
}
// ======== KHU VỰC ==========
tours.on('value', function (snapshot) {
    var optionArea = '<option value="">----Khu vực----</option>';
    Object.entries(snapshot.val()).forEach(el => {
        optionArea += `<option value="${el[0]}">${doiTenMien(el[0])}</option>`;
    });
    khuvuc.innerHTML = optionArea;
    khuvuc.addEventListener('change', () => {
        time.innerHTML = '<option value="">----Lựa chọn thời gian----</option>'; // xoá thời gian tour khi khu vực thay đổi
        ngayKhoiHanh.innerHTML = '<option>----Ngày khởi hành----</option>'; // xoá ngày khởi hành
        ngayQuayVe.value = null;                                            // xoá ngày quay về


        if (khuvuc.value) {
            let danhsachTuyen = snapshot.val()[khuvuc.value];
            themTuyen(danhsachTuyen);
            // [ 0: {id: "-MOiSixr9LOrwPKZP", ngay: Array(2), songuoi: 10, tuyen: "Du lịch Quan Lạn"}]
        }
        tuyen.addEventListener('change', () => {
            ngayKhoiHanh.innerHTML = '<option>----Ngày khởi hành----</option>'; // xoá ngày khởi hành
            ngayQuayVe.value = null;                                            // xoá ngày quay về

            let index = parseInt(tuyen.value); //  {id: "-MOiSixr9LOrwPKZP", ngay: Array(2), songuoi: 10, tuyen: "Du lịch Quan Lạn"}
            let ngay = snapshot.val()[khuvuc.value][index].ngay;  // ngay: Array(2)
            var songuoi = snapshot.val()[khuvuc.value][index].songuoi;  //songuoi: 10

            soNguoi.value = songuoi; // gán số người tối đa cho input Số người

            themThoiGianTour(ngay);

            soNguoi.addEventListener('input', (e) => { // bắt sự kiện nhập vào input soNguoi
                let _songuoi = e.target.value;
                if (_songuoi && _songuoi <= 0 || _songuoi > songuoi) {
                    alert(`Số người trong khoảng [0..${songuoi}]`);
                    soNguoi.value = 0;
                }
            });
        });

        thoigianTour.addEventListener('change', () => {
            let ngayKH = new Date(thoigianTour.value);  // Thời gian tour: 1/5/2021
            ngayKhoiHanh.innerHTML = `<option >${ngayKH.getDate()}/${ngayKH.getMonth() + 1}/${ngayKH.getFullYear()}</option>`;

            let songay = parseInt(thoigianTour.options[thoigianTour.selectedIndex].text); // lấy giá trị đang chọn combobox            
            ngayKH.setDate(ngayKH.getDate() + songay);
            ngayQuayVe.value = `${ngayKH.getDate()}/${ngayKH.getMonth() + 1}/${ngayKH.getFullYear()}`;
        });
    })
});
// ============= TUYẾN =============
function themTuyen(danhsachTuyen) {
    var optionTours = '<option value="">----Tuyến----</option>';
    var count = 0;
    danhsachTuyen.forEach(el => {
        optionTours += `<option value="${count++}">${el.tuyen}</option>`;
    });
    tuyen.innerHTML = optionTours;
}
// ======== THỜI GIAN TOUR ==========
function themThoiGianTour(ngay) {
    var optionTimes = '<option value="">----Lựa chọn thời gian----</option>';
    var count = 0;
    ngay.forEach(el => {
        let [ngayDi, soNgay, soDem] = el.ngaykhoihanh.split('-'); //["1/1/2021", "3N", "2D"]
        optionTimes += `<option value="${ngayDi}">${tongSoNgayDi(soNgay, soDem)}</option>`;
    });
    time.innerHTML = optionTimes;
}




form.addEventListener('submit', (e) => {
    e.preventDefault();
    var hoten = document.getElementById('name').value;
    var sdt = document.getElementById('tel').value;
    var email = document.getElementById('email').value;
    var diachi = document.getElementById('addr').value;
    var _khuvuc = khuvuc.options[khuvuc.selectedIndex].text;
    var _tuyen = tuyen.options[tuyen.selectedIndex].text;
    var _thoigianTour = thoigianTour.options[thoigianTour.selectedIndex].text;
    var _ngaykhoihanh = ngayKhoiHanh.options[ngayKhoiHanh.selectedIndex].text;
    var huongdanvien1 = document.getElementById('tguide-1').value;
    var huongdanvien2 = document.getElementById('tguide-2').value;
    var taixe = document.getElementById('driver').value;
    var chiphi = document.getElementById('cost').value;
    var khachhang = {
        hoten,
        sdt,
        email,
        diachi,
        "khuvuc": _khuvuc,
        "tuyen": _tuyen,
        "thoigiantour": _thoigianTour,
        "ngaykhoihanh": toMM_dd_yyyy(_ngaykhoihanh),
        "ngayquayve": toMM_dd_yyyy(ngayQuayVe.value),
        "songuoi": soNguoi.value,
        huongdanvien1,
        huongdanvien2,
        taixe,
        chiphi
    };
    const key = tours.push().key;
    let data = {};
    data['/tourDaDangKy/' + key] = khachhang;
    console.log(data);
    firebase.database().ref().update(data);
    alert('Thêm dữ liệu thành công!');
});

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
