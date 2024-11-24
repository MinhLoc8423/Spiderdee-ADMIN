import React, { useEffect, useState } from "react";
import AxiosInstance from '../helper/AsioxInstance';
import swal from 'sweetalert';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './List.css';


const List = (props) => {
    const { saveUser } = props;
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const result = await AxiosInstance().get("/api/products/");
            setProducts(result.data);
        };
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        swal({
            title: "Xác nhận xóa sản phẩm",
            text: "Bạn có chắc chắn muốn xóa sản phẩm này?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then(async (willDelete) => {
                if (willDelete) {
                    try {
                        const result = await AxiosInstance().delete(`/api/products/` + id);
                        if (result.status === 200) {
                            swal("Xóa sản phẩm thành cong!");
                            const updatedProducts = products.filter(item => item._id !== id);
                            setProducts(updatedProducts);
                        } else {
                            swal('Xóa sản phẩm thất bại!');
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            });
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                                <a className="nav-link text-secondary" href="/products">Sản phẩm</a>
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
                    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
                        <h2>Sản phẩm</h2>
                        <div className="d-flex justify-content-end mb-3">
                        <input
                            type="text"
                            className="form-control w-100 mt-3"
                            placeholder="Tìm kiếm tên sản phẩm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    </div>

                    {/* Product Cards */}
                    <div className="row">
                        {
                            filteredProducts.length > 0 ? (
                                filteredProducts.map((item) => (
                                    <div className="col-md-4 mb-4" key={item._id}>
                                        <div className="card h-100">
                                            <img src={item.image} alt={item.name} className="card-img-top" style={{ height: '200px', objectFit: 'cover' }} />
                                            <div className="card-body">
                                                <h5 className="card-title product-title">{item.name}</h5>
                                                <p className="card-text description">{item.description}</p>
                                                <p className="card-text"><strong>Giá:</strong> {item.price.toLocaleString()} VNĐ</p>
                                            </div>
                                            <div className="card-footer d-flex justify-content-between">
                                                <a href={`/products/edit-product/${item._id}`} className="btn btn-primary">Sửa sản phẩm</a>
                                                <button onClick={() => handleDelete(item._id)} className="btn btn-danger">Xóa</button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-12 text-center">
                                    <p>Không tìm thấy sản phẩm</p>
                                </div>
                            )
                        }
                    </div>
                </main>
            </div>

            {/* Floating Add Button */}
            <a href="/products/add-product" className="btn btn-success fab-btn">
                <i className="bi bi-plus"></i> 
            </a>
        </div>
    );
};

export default List;
