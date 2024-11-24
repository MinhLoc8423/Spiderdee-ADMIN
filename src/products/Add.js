import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AxiosInstance from "../helper/AsioxInstance";
import swal from 'sweetalert';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap'; // Import Modal và Button từ React Bootstrap

const Add = (props) => {
    const { saveUser } = props;
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [sizes, setSizes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newSize, setNewSize] = useState("");
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");

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

    const handleImageURLChange = (e) => {
        const url = e.target.value;
        setImage(url);
        setImagePreview(url);
    };

    const handleAddSize = () => {
        if (newSize) {
            setSizes((prevSizes) => [...prevSizes, newSize]);
            setNewSize(""); // Reset input size
            setShowModal(false); // Đóng modal sau khi thêm kích thước
        }
    };

    const handleRemoveSize = (sizeToRemove) => {
        setSizes(sizes.filter((size) => size !== sizeToRemove));
    };

    const handleAddProduct = async () => {
        swal({
            title: "Vui lòng xác nhận",
            text: "Bạn có chắc chắn muốn thêm sản phẩm này?",
            icon: "warning",
            buttons: true,
            closeOnEsc: true,
        })
            .then(async (willAdd) => {
                if (willAdd) {
                    if (!title || !content || !price || !image || !selectedCategory) {
                        swal("Vui lòng nhập đầy đủ thông tin");
                        return;
                    }

                    const body = {
                        name: title,
                        description: content,
                        price: price,
                        image: image,
                        size: sizes,
                        category_id: selectedCategory,
                    };

                    try {
                        const result = await AxiosInstance().post(`/api/products/`, body);
                        console.log(result);
                        if (result.status === 201) {
                            swal("Thêm sản phẩm thành công!", "", "success");
                            navigate('/products'); 
                        } else {
                            swal("Thêm sản phẩm thất bại!", "", "error");
                        }
                    } catch (error) {
                        console.error("Error adding product:", error);
                        swal("Có lỗi xảy ra khi thêm sản phẩm.", "", "error");
                    }
                }
            });
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <nav className="col-md-3 col-lg-2 d-md-block bg-dark sidebar">
                    <div className="position-sticky pt-3">
                        <h4 className="text-white text-center my-4">SPIDERDEE</h4>
                        <ul className="nav flex-column">
                            <li className="nav-item"><a className="nav-link text-white" href="/">Bảng điều khiển</a></li>
                            <li className="nav-item"><a className="nav-link text-secondary" href="/products">Sản phẩm</a></li>
                            <li className="nav-item"><a className="nav-link text-white" href="/categories">Loại sản phẩm</a></li>
                            <li className="nav-item"><a className="nav-link text-white" href="/orders">Đơn hàng</a></li>
                            <li className="nav-item">
                                <a className="nav-link text-white" href="/customers">Khách hàng</a>
                            </li>
                            <li className="nav-item"><a className="nav-link text-white" href="/users">Tài khoản</a></li>
                            <li className="nav-item"><a className="nav-link text-white" onClick={() => saveUser(null)}>Đăng xuất</a></li>
                        </ul>
                    </div>
                </nav>
                <main className="col-md-9 col-lg-10 ms-sm-auto px-md-4">
                    <h2 className="my-4">Thêm sản phẩm mới</h2>
                    <form>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Tên sản phẩm</label>
                            <input
                                type="text"
                                className="form-control"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Mô tả</label>
                            <input
                                type="text"
                                className="form-control"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Giá</label>
                            <input
                                type="number"
                                className="form-control"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Hình ảnh (URL)</label>
                            <input
                                type="text"
                                className="form-control"
                                value={image}
                                onChange={handleImageURLChange}
                                placeholder="Nhập link ảnh"
                            />
                            {imagePreview && (
                                <div className="mt-3">
                                    <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', maxHeight: 250, maxWidth: 250 }} />
                                </div>
                            )}
                        </div>

                        {/* Dropdown select for category */}
                        <div className="mb-3">
                            <label className="form-label fw-bold">Chọn danh mục</label>
                            <select
                                className="form-control"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="">Chọn danh mục</option>
                                {categories.map((category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Kích thước</label>
                            <div>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(true)}>Thêm kích thước</button>
                                <ul className="mt-2">
                                    {sizes.map((size, index) => (
                                        <li key={index} className="d-flex justify-content-between">
                                            {size}
                                            <button type="button" className="btn btn-danger btn-sm" onClick={() => handleRemoveSize(size)}>Xóa</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <button type="button" className="btn btn-success" onClick={handleAddProduct}>Thêm sản phẩm</button>
                    </form>

                    {/* Modal để thêm kích thước */}
                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Thêm Kích Thước Mới</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <input
                                type="text"
                                className="form-control"
                                value={newSize}
                                onChange={(e) => setNewSize(e.target.value)}
                                placeholder="Nhập kích thước mới"
                            />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
                            <Button variant="primary" onClick={handleAddSize}>Thêm</Button>
                        </Modal.Footer>
                    </Modal>
                </main>
            </div>
        </div>
    );
};

export default Add;
