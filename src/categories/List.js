import React, { useEffect, useState } from "react";
import AxiosInstance from '../helper/AsioxInstance';
import swal from 'sweetalert';
import { Modal, Button, Form } from 'react-bootstrap';

const CategoryList = (props) => {
    const { user, saveUser } = props;
    const [categories, setCategories] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);  // Modal cho sửa danh mục
    const [showAddModal, setShowAddModal] = useState(false);    // Modal cho thêm danh mục
    const [currentCategory, setCurrentCategory] = useState({
        _id: '',
        name: ''
    });
    const [newCategoryName, setNewCategoryName] = useState('');  // Tên danh mục mới khi thêm

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const result = await AxiosInstance().get(`/api/categories/`);
                setCategories(result.data);
            } catch (error) {
                console.error("Error fetching category data:", error);
            }
        };
        fetchCategory();
    }, []);

    const handleDelete = async (id) => {
        swal({
            title: "Xác nhận xóa",
            text: "Bạn có chắc chắn muốn xóa danh mục này?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then(async (willDelete) => {
            if (willDelete) {
                try {
                    const result = await AxiosInstance().delete(`/api/categories/${id}`);
                    if (result.status === 200) {
                        swal("Xóa thành công");
                        const updatedCategories = categories.filter(item => item._id !== id);
                        setCategories(updatedCategories);
                    } else {
                        swal('Xóa thất bại');
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        });
    };

    const handleShowEditModal = (category) => {
        setCurrentCategory(category);
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setCurrentCategory({ _id: '', name: '' });
    };

    const handleShowAddModal = () => {
        setShowAddModal(true);
    };

    const handleCloseAddModal = () => {
        setShowAddModal(false);
        setNewCategoryName('');
    };

    const handleSaveChanges = async () => {
        try {
            const result = await AxiosInstance().put(`/api/categories/${currentCategory._id}`, currentCategory);
            if (result.status === 200) {
                swal("Cập nhật thành công");
                const updatedCategories = categories.map(category =>
                    category._id === currentCategory._id ? currentCategory : category
                );
                setCategories(updatedCategories);
                handleCloseEditModal();
            } else {
                swal('Cập nhật thất bại');
            }
        } catch (error) {
            console.log(error);
            swal('Có lỗi xảy ra!');
        }
    };

    const handleAddCategory = async () => {
        if (!newCategoryName) {
            swal('Vui lòng nhập tên danh mục!');
            return;
        }

        try {
            const newCategory = { name: newCategoryName };
            const result = await AxiosInstance().post('/api/categories', newCategory);
            if (result.status === 201) {
                swal("Thêm danh mục thành công");
                setCategories([...categories, result.data]);
                handleCloseAddModal();
            } else {
                swal('Thêm danh mục thất bại');
            }
        } catch (error) {
            console.log(error);
            swal('Có lỗi xảy ra!');
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
                                <a className="nav-link text-white" href="/">Bảng điều khiển</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-white" href="/products">Sản phẩm</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-secondary" href="/categories">Loại sản phẩm</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-white" href="/orders">Đơn hàng</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-white" href="/customers">Khách hàng</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-white" href="/users">Tài khoản</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-white" onClick={() => saveUser(null)}>Đăng xuất</a>
                            </li>
                        </ul>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="col-md-9 col-lg-10 ms-sm-auto px-md-4">
                    <h2 className="mb-4">Danh mục sản phẩm</h2>

                    {/* List Categories */}
                    <div className="row">
                        {
                            categories.length > 0 ? (
                                categories.map((category) => (
                                    <div className="col-md-4 mb-4" key={category._id}>
                                        <div className="card h-100">
                                            <div className="card-body">
                                                <h5 className="card-title">{category.name}</h5>
                                            </div>
                                            <div className="card-footer d-flex justify-content-between">
                                                <button onClick={() => handleShowEditModal(category)} className="btn btn-primary">Sửa</button>
                                                <button onClick={() => handleDelete(category._id)} className="btn btn-danger">Xóa</button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-12 text-center">
                                    <p>Không có danh mục nào</p>
                                </div>
                            )
                        }
                    </div>
                </main>
            </div>

            {/* Floating Add Button */}
            <a href="#" onClick={handleShowAddModal} className="btn btn-success fab-btn">
                <i className="bi bi-plus"></i>
            </a>

            {/* Modal for Edit Category */}
            <Modal show={showEditModal} onHide={handleCloseEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Sửa danh mục</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="categoryName">
                            <Form.Label>Tên danh mục</Form.Label>
                            <Form.Control
                                type="text"
                                value={currentCategory.name}
                                onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEditModal}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleSaveChanges}>
                        Lưu thay đổi
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for Add New Category */}
            <Modal show={showAddModal} onHide={handleCloseAddModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm danh mục mới</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="newCategoryName">
                            <Form.Label>Tên danh mục</Form.Label>
                            <Form.Control
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="Nhập tên danh mục mới"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAddModal}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleAddCategory}>
                        Thêm danh mục
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CategoryList;
