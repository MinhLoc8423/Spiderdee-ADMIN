import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import AxiosInstance from '../helper/AsioxInstance';
import { Modal, Button } from 'react-bootstrap';
import swal from 'sweetalert';

const Profile = (props) => {
    const { user, saveUser } = props;
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [avatar, setAvatar] = useState('');
    const [createdAt, setCreatedAt] = useState('');
    const [roleName, setRoleName] = useState('');
    const [showModal, setShowModal] = useState(false);

    // Models
    const [firstNameEdit, setFirstNameEdit] = useState('');
    const [lastNameEdit, setLastNameEdit] = useState('');
    const [phoneEdit, setPhoneEdit] = useState('');


    const handleProfile = async () => {
        const response = await AxiosInstance().get(`/api/users/${user.data.user_id}`);
        setFirstName(response.data.first_name);
        setLastName(response.data.last_name);
        setEmail(response.data.email);
        setPhoneNumber(response.data.phone_number);
        setAvatar(response.data.avatar);
        setCreatedAt(new Date(response.data.createdAt).toLocaleDateString());
        setRoleName(response.data.role.role_name);
        setFirstNameEdit(response.data.first_name);
        setLastNameEdit(response.data.last_name);
        setPhoneEdit(response.data.phone_number);
    };

    useEffect(() => {
        handleProfile();
    }, []);

    const handleUpdateProfile = async () => {
        const response = await AxiosInstance().put(`/api/users/${user.data.user_id}`, {
            first_name: firstNameEdit,
            last_name: lastNameEdit,
            phone_number: phoneEdit,
        });
        console.log(response);
        if (response.status === 200) {
            setShowModal(false);
            handleProfile(); 
            swal("Thành công!", "Thông tin cá nhân đã được cập nhật.", "success");
        } else {
            swal("Thất bại!", "Cập nhật thất bại!", "error");
        }
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <nav className="col-md-3 col-lg-2 d-md-block bg-dark sidebar">
                    <div className="position-sticky pt-3">
                        <h4 className="text-white text-center my-4">SPIDERDEE</h4>
                        <ul className="nav flex-column">
                            <li className="nav-item">
                                <a className="nav-link text-white" href="/">Bảng điều khiển</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-white" href="/products">Sản phẩm</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-white" href="/categories">Loại sản phẩm</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-white" href="/orders">Đơn hàng</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-white" href="/customers">Khách hàng</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-secondary" href="/users">Tài khoản</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-white" onClick={() => saveUser(null)}>Đăng xuất</a>
                            </li>
                        </ul>
                    </div>
                </nav>

                <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                        <h1 className="h2">Thông tin cá nhân</h1>
                        <Button variant="outline-primary" onClick={() => setShowModal(true)}>Chỉnh sửa</Button>
                    </div>

                    <div className="card mb-4">
                        <div className="card-body">
                            <div className="d-flex align-items-start mb-3">
                                <img src={avatar || "https://plus.unsplash.com/premium_vector-1720624421524-528dacec899b?q=80&w=1800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} alt="Avatar" className="rounded-circle me-3" width="120" height="120" />
                                <div>
                                    <h4>{firstName} {lastName}</h4>
                                    <p className="text-muted">{roleName}</p>
                                </div>
                            </div>
                            <hr />

                            <div className="row">
                                <div className="col-md-6">
                                    <h6>Email:</h6>
                                    <p>{email}</p>
                                </div>
                                <div className="col-md-6">
                                    <h6>Số điện thoại:</h6>
                                    <p>{phoneNumber}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <h6>Ngày tạo tài khoản:</h6>
                                    <p>{createdAt}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Modal for Editing Profile */}
                    <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static">
                        <Modal.Header closeButton>
                            <Modal.Title>Chỉnh sửa thông tin cá nhân</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form>
                                <div className="mb-3">
                                    <label>Họ</label>
                                    <input type="text" className="form-control" value={firstNameEdit} onChange={(e) => setFirstNameEdit(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label>Tên</label>
                                    <input type="text" className="form-control" value={lastNameEdit} onChange={(e) => setLastNameEdit(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label>Email</label>
                                    <input type="email" disabled={true} className="form-control" value={email} />
                                </div>
                                <div className="mb-3">
                                    <label>Số điện thoại</label>
                                    <input type="text" className="form-control" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                                </div>
                            </form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>Đóng</Button>
                            <Button variant="primary" onClick={handleUpdateProfile}>Lưu thay đổi</Button>
                        </Modal.Footer>
                    </Modal>
                </main>
            </div>
        </div>
    );
};

export default Profile;
