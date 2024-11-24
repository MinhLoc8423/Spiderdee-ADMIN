import React, { useEffect, useState } from "react";
import AxiosInstance from '../helper/AsioxInstance';
import swal from 'sweetalert';
import { Modal, Button, Form, Accordion } from 'react-bootstrap';

const OrderList = (props) => {
    const { user, saveUser } = props;
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showProductsModal, setShowProductsModal] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [orderdetails, setOrderDetails] = useState([]);
    const [currentOrder, setCurrentOrder] = useState({
        _id: '',
        status: '',
        payment_method: ''
    });
    const [filterCriteria, setFilterCriteria] = useState({
        orderId: '',
        minPrice: '',
        maxPrice: '',
        payment_method: '',
        status: ''
    });

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const result = await AxiosInstance().get(`/api/orders/`);
                setOrders(result.data);
                setFilteredOrders(result.data);
            } catch (error) {
                console.error("Error fetching order data:", error);
            }
        };
        fetchOrders();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilterCriteria(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const applyFilters = () => {
        let updatedOrders = orders;

        // Filter by Order ID
        if (filterCriteria.orderId) {
            updatedOrders = updatedOrders.filter(order =>
                order._id.toLowerCase().includes(filterCriteria.orderId.toLowerCase())
            );
        }

        // Filter by minimum price
        if (filterCriteria.minPrice) {
            updatedOrders = updatedOrders.filter(order =>
                Number(order.total_price.$numberDecimal) >= Number(filterCriteria.minPrice)
            );
        }

        // Filter by maximum price
        if (filterCriteria.maxPrice) {
            updatedOrders = updatedOrders.filter(order =>
                Number(order.total_price.$numberDecimal) <= Number(filterCriteria.maxPrice)
            );
        }

        // Filter by payment method
        if (filterCriteria.payment_method) {
            updatedOrders = updatedOrders.filter(order =>
                order.payment_method === filterCriteria.payment_method
            );
        }

        // Filter by status
        if (filterCriteria.status) {
            updatedOrders = updatedOrders.filter(order =>
                order.status === filterCriteria.status
            );
        }

        setFilteredOrders(updatedOrders);
        setShowFilterModal(false); // Close the filter modal after applying filters
    };

    const hanldeGetOrderDetails = async (id) => {
        try {
            const result = await AxiosInstance().get(`/api/order-details/order/${id}`);
            setOrderDetails(result.data);
            setShowProductsModal(true);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = async (id) => {
        swal({
            title: "Xác nhận xóa",
            text: "Bạn có chắc chắn muốn xóa đơn hàng này?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then(async (willDelete) => {
                if (willDelete) {
                    try {
                        const result = await AxiosInstance().delete(`/api/orders/${id}`);
                        if (result.status === 200) {
                            swal("Xóa thành công");
                            // Remove from both `orders` and `filteredOrders`
                            const updatedOrders = orders.filter(item => item._id !== id);
                            setOrders(updatedOrders);
                            setFilteredOrders(updatedOrders);
                        } else {
                            swal('Xóa thất bại');
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            });
    };

    const handleShowEditModal = (order) => {
        setCurrentOrder({
            _id: order._id,
            status: order.status,
            products: order.products || [],
            payment_method: order.payment_method
        });
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setCurrentOrder({ _id: '', status: '', products: [], payment_method: '' });
    };

    const handleSaveChanges = async () => {
        try {
            const result = await AxiosInstance().put(`/api/orders/status/${currentOrder._id}`, currentOrder);
            if (result.status === 200) {
                swal("Cập nhật thành công");
                const updatedOrder = result.data;
                
                // Update both `orders` and `filteredOrders` with new status
                const updatedOrders = orders.map(order =>
                    order._id === updatedOrder._id ? updatedOrder : order
                );
                setOrders(updatedOrders);
                setFilteredOrders(updatedOrders);
                handleCloseEditModal();
            } else {
                swal('Cập nhật thất bại');
            }
        } catch (error) {
            console.log(error);
            swal('Có lỗi xảy ra!');
        }
    };

    const handleCloseProductsModal = () => {
        setShowProductsModal(false);
        setOrderDetails([]);
    };

    return (
        <div className="container-fluid">
            <div className="row">
                {/* Sidebar */}
                <nav className="col-md-3 col-lg-2 d-md-block bg-dark sidebar">
                    <div className="position-sticky pt-3">
                        <h4 className="text-white text-center my-4">SPIDERDEE</h4>
                        <ul className="nav flex-column">
                            <li className="nav-item"><a className="nav-link text-white" href="/">Bảng điều khiển</a></li>
                            <li className="nav-item"><a className="nav-link text-white" href="/products">Sản phẩm</a></li>
                            <li className="nav-item"><a className="nav-link text-white" href="/categories">Loại sản phẩm</a></li>
                            <li className="nav-item"><a className="nav-link text-secondary" href="/orders">Đơn hàng</a></li>
                            <li className="nav-item">
                                <a className="nav-link text-white" href="/customers">Khách hàng</a>
                            </li>
                            <li className="nav-item"><a className="nav-link text-white" href="/users">Tài khoản</a></li>
                            <li className="nav-item"><a className="nav-link text-white" onClick={() => saveUser(null)}>Đăng xuất</a></li>
                        </ul>
                    </div>
                </nav>

                {/* Main Content */}
                <div className="col-md-9 ms-sm-auto col-lg-10 px-4">
                    <h2 className="my-4">Danh sách đơn hàng</h2>

                    {/* Filter Button */}
                    <Button variant="primary" onClick={() => setShowFilterModal(true)}>
                        Lọc Đơn Hàng
                    </Button>

                    {/* Orders Table */}
                    <table className="table table-striped mt-3">
                        <thead>
                            <tr>
                                <th scope="col">Mã Đơn Hàng</th>
                                <th scope="col">Tổng Tiền</th>
                                <th scope="col">Phương Thức</th>
                                <th scope="col">Trạng Thái</th>
                                <th scope="col">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{Number(order.total_price.$numberDecimal).toLocaleString()} VND</td>
                                    <td>{order.payment_method}</td>
                                    <td>{order.status}</td>
                                    <td>
                                        <Button
                                            variant="warning"
                                            onClick={() => handleShowEditModal(order)}
                                            disabled={["Đã giao hàng", "Đã hủy"].includes(order.status)}
                                            className="me-2"
                                        >
                                            Cập nhật trạng thái
                                        </Button>
                                        <Button
                                            variant="primary"
                                            onClick={() => hanldeGetOrderDetails(order._id)}
                                            className="me-2"
                                        >
                                            Xem sản phẩm
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() => handleDelete(order._id)}
                                        >
                                            Xóa
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Filter Modal */}
            <Modal show={showFilterModal} onHide={() => setShowFilterModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Lọc Đơn Hàng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Mã Đơn Hàng</Form.Label>
                            <Form.Control
                                type="text"
                                name="orderId"
                                placeholder="Nhập mã đơn hàng"
                                value={filterCriteria.orderId}
                                onChange={handleFilterChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Giá tối thiểu</Form.Label>
                            <Form.Control
                                type="number"
                                name="minPrice"
                                placeholder="Nhập giá tối thiểu"
                                value={filterCriteria.minPrice}
                                onChange={handleFilterChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Giá tối đa</Form.Label>
                            <Form.Control
                                type="number"
                                name="maxPrice"
                                placeholder="Nhập giá tối đa"
                                value={filterCriteria.maxPrice}
                                onChange={handleFilterChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Phương Thức Thanh Toán</Form.Label>
                            <Form.Select
                                name="payment_method"
                                value={filterCriteria.payment_method}
                                onChange={handleFilterChange}
                            >
                                <option value="">Tất cả</option>
                                <option value="Tiền mặt">Tiền mặt</option>
                                <option value="ZaloPay">ZaloPay</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Trạng Thái</Form.Label>
                            <Form.Select
                                name="status"
                                value={filterCriteria.status}
                                onChange={handleFilterChange}
                            >
                                <option value="">Tất cả</option>
                                <option>Đặt hàng thành công</option>
                                <option>Chờ thanh toán</option>
                                <option>Đã xác nhận thanh toán</option>
                                <option>Đang xử lý đơn hàng</option>
                                <option>Đang vận chuyển</option>
                                <option>Đã giao hàng</option>
                                <option>Đã hủy</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowFilterModal(false)}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={applyFilters}>
                        Áp dụng
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Order Modal */}
            <Modal show={showEditModal} onHide={handleCloseEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Chỉnh sửa đơn hàng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formStatus">
                            <Form.Label>Trạng Thái</Form.Label>
                            <Form.Control
                                as="select"
                                value={currentOrder.status}
                                onChange={(e) => setCurrentOrder({ ...currentOrder, status: e.target.value })}
                            >
                                {currentOrder.payment_method === "ZaloPay" ? (
                                    <>
                                        <option>Đặt hàng thành công</option>
                                        <option>Chờ thanh toán</option>
                                        <option>Đã xác nhận thanh toán</option>
                                        <option>Đang xử lý đơn hàng</option>
                                        <option>Đang vận chuyển</option>
                                        <option>Đã giao hàng</option>
                                        <option>Đã hủy</option>
                                    </>
                                ) : (
                                    <>
                                        <option>Đặt hàng thành công</option>
                                        <option>Đã xác nhận thanh toán</option>
                                        <option>Đang xử lý đơn hàng</option>
                                        <option>Đang vận chuyển</option>
                                        <option>Đã giao hàng</option>
                                        <option>Đã hủy</option>
                                    </>
                                )}
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEditModal}>Đóng</Button>
                    <Button variant="primary" onClick={handleSaveChanges}>Lưu thay đổi</Button>
                </Modal.Footer>
            </Modal>

            {/* Order Products Modal */}
            <Modal show={showProductsModal} onHide={handleCloseProductsModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Sản phẩm trong đơn hàng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Accordion defaultActiveKey="0">
                        {orderdetails.map((product, index) => (
                            <Accordion.Item eventKey={index.toString()} key={product._id}>
                                <Accordion.Header>{product.name}</Accordion.Header>
                                <Accordion.Body>
                                    <p>Số lượng: {product.quantity}</p>
                                    <p>Giá: {Number(product.price.$numberDecimal).toLocaleString()} VND</p>
                                    <p>Kích thước: {product.size}</p>
                                    <p>Ngày tạo: {new Date(product.createdAt).toLocaleDateString()}</p>
                                </Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseProductsModal}>Đóng</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default OrderList;
