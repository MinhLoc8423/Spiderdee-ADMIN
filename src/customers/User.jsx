import React, { useEffect, useState } from "react";
import swal from "sweetalert";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import AxiosInstance from "../helper/AsioxInstance";

const UserList = (props) => {
  const { saveUser } = props;
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false); // Trạng thái hiển thị modal
  const [selectedUser, setSelectedUser] = useState(null); // Lưu trữ thông tin người dùng đang được chỉnh sửa

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        // Lấy danh sách vai trò từ API (Demo giả lập)
        const result = await AxiosInstance().get(`/api/roles/`);
        setRoles(result.data);
      } catch (error) {
        console.error("Error fetching roles data:", error);
      }
    };
    const fetchUsers = async () => {
      try {
        const result = await AxiosInstance().get(`/api/users/`);
        const data = result.data.users;
        const filteredUsers = data.filter(
          (user) => user.role_id.role_name !== "Admin"
        );
        setUsers(filteredUsers);
        console.log(filteredUsers);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUsers();
    fetchRoles();
    console.log(users);
  }, []);

  const handleDelete = async (id) => {
    swal({
      title: "Xác nhận xóa tài khoản",
      text: "Bạn có chắc chắn muốn xóa tài khoản này?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          const result = await AxiosInstance().delete(`/api/users/${id}`);
          if (result.status == 200) {
            const updatedUsers = users.filter((item) => item._id !== id);
            setUsers(updatedUsers);
            swal("Xóa tài khoản thành công!");
          }
        } catch (error) {
          swal({
            title: "Xóa tài khoản thất bại!",
            icon: "error",
            dangerMode: true,
          });
        }
      }
    });
  };

  const filteredUsers = users.filter(
    (user) =>
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mở modal và set thông tin người dùng để chỉnh sửa
  const openEditModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  // Đóng modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  // Cập nhật thông tin người dùng
  const handleUpdate = async () => {
    console.log(selectedUser);
    try {
      const result = await AxiosInstance().put(
        `/api/admin/users/${selectedUser._id}`,
        selectedUser
      );
      if (result.status === 200) {
        setUsers(
          users.map((user) =>
            user._id === selectedUser._id ? selectedUser : user
          )
        );
        swal("Cập nhật tài khoản thành công!");
        closeModal(); // Đóng modal sau khi cập nhật thành công
      }
    } catch (error) {
      swal("Cập nhật tài khoản thất bại!", error);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <nav className="col-md-3 col-lg-2 d-md-block bg-dark sidebar">
          <div className="position-sticky pt-3">
            <h4 className="text-white text-center my-4">SPIDERDEE</h4>
            <ul className="nav flex-column">
              <li className="nav-item">
                <a className="nav-link text-white" href="/">
                  Bảng điều khiển
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="/products">
                  Sản phẩm
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="/categories">
                  Loại sản phẩm
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="/orders">
                  Đơn hàng
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-secondary" href="/customers">
                  Khách hàng
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="/users">
                  Tài khoản
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link text-white"
                  onClick={() => saveUser(null)}
                >
                  Đăng xuất
                </a>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="col-md-9 col-lg-10 ms-sm-auto px-md-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
            <h2>Tài khoản Khách hàng</h2>
            <div className="d-flex justify-content-end mb-3">
              <input
                type="text"
                className="form-control w-100 mt-3"
                placeholder="Tìm kiếm người dùng"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* User Cards */}
          <div className="row">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((item) => (
                <div className="col-md-4 mb-4" key={item._id}>
                  <div className="card h-100">
                    <div className="card-body d-flex flex-column align-items-center position-relative">
                      {/* Vai trò (Role) */}
                      <span
                        className="badge bg-info text-info-emphasis position-absolute"
                        style={{
                          top: "10px",
                          left: "10px",
                          fontSize: "0.9rem",
                          padding: "5px 10px",
                          borderRadius: "10px",
                        }}
                      >
                        {item.role_id?.role_name == "Manager"
                          ? "Quản lý"
                          : "Người dùng"}
                      </span>
                      {/* Avatar */}
                      <img
                        src={
                          item.avatar ||
                          "https://img.freepik.com/free-vector/follow-me-social-business-theme-design_24877-52233.jpg?t=st=1732446504~exp=1732450104~hmac=e94dadfbf2a9a9eab602e222f2230fae45596c38245e6776e32747c1136e7996&w=740"
                        }
                        alt={item.first_name + " " + item.last_name}
                        className="card-img-top rounded-circle"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                      />
                      {/* Nút chỉnh sửa */}
                      <button
                        onClick={() => openEditModal(item)}
                        className="btn btn-primary position-absolute"
                        style={{ top: "10px", right: "10px" }}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <h5 className="card-title mt-3">
                        {item.first_name} {item.last_name}
                      </h5>
                      <p className="card-text">Email: {item.email}</p>
                      <p className="card-text">
                        Số điện thoại: {item.phone_number}
                      </p>
                    </div>
                    <div className="card-footer d-flex justify-content-between w-100">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="btn btn-danger w-100 d-block"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                <p>Không tìm thấy người dùng</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal chỉnh sửa người dùng */}
      {showModal && (
        <>
          <div
            className="modal-backdrop fade show"
            style={{ zIndex: 1040 }} // Đảm bảo lớp backdrop nằm dưới modal
          ></div>
          <div
            className="modal fade show"
            tabIndex="-1"
            style={{ display: "block", zIndex: 1050 }} // Đảm bảo modal nằm trên lớp backdrop
            aria-modal="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    Chỉnh sửa thông tin người dùng
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    onClick={closeModal}
                  ></button>
                </div>
                <div className="modal-body">
                  {/* Form chỉnh sửa */}
                  <div className="mb-3">
                    <label className="form-label">Họ</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedUser?.first_name || ""}
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          first_name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Tên</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedUser?.last_name || ""}
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          last_name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={selectedUser?.email || ""}
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Số điện thoại</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedUser?.phone_number || ""}
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          phone_number: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Vai trò</label>
                    <select
                      className="form-select"
                      value={selectedUser?.role_id?._id || ""}
                      onChange={(e) => {
                        const selectedRole = roles.find(
                          (role) => role._id === e.target.value
                        );
                        setSelectedUser({
                          ...selectedUser,
                          role_id: selectedRole,
                        });
                      }}
                    >
                      {roles
                        .filter(
                          (role) =>
                            role.role_name === "Manager" ||
                            role.role_name === "User"
                        ) // Lọc chỉ "Manager" và "User"
                        .map((role) => (
                          <option key={role._id} value={role._id}>
                            {role.role_name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                  >
                    Đóng
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleUpdate}
                  >
                    Lưu thay đổi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserList;
