import React, { useEffect, useState } from "react";
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import AxiosInstance from '../helper/AsioxInstance';
import './List.css';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const List = (props) => {
    const { saveUser } = props;
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [favoriteProducts, setFavoriteProducts] = useState([]);
    const [salesData, setSalesData] = useState([]);
    const [topSellingProducts, setTopSellingProducts] = useState([]);
    const [orderStats, setOrderStats] = useState({
        success: 0, // Đặt hàng thành công
        pending: 0, // Chờ thanh toán
        confirmed: 0, // Đã xác nhận thanh toán
        processing: 0, // Đang xử lý đơn hàng
        shipping: 0, // Đang vận chuyển
        delivered: 0, // Đã giao hàng
        canceled: 0, // Đã hủy
    });

    const getDataUsers = async () => {
        const response = await AxiosInstance().get(`/api/users/`);
        setUsers(response.data.users);
    };

    const getDataProducts = async () => {
        const response = await AxiosInstance().get(`/api/products/`);
        setProducts(response.data);
    };

    const getDataFavoriteProducts = async () => {
        const response = await AxiosInstance().get(`/api/wish-list/`);
        const favoriteProductIds = response.data.map(item => item.product_id);
        const uniqueProductIds = [...new Set(favoriteProductIds)];
        setFavoriteProducts(uniqueProductIds);
    };

    const getStatusOrder = async () => {
        const response = await AxiosInstance().get(`/api/orders/`);
        console.log('response', response);
        const orderData = response.data;  // Lấy tất cả đơn hàng từ API
        const statusCount = {
            "Đặt hàng thành công": "success",
            "Chờ thanh toán": "pending",
            "Đang xử lý đơn hàng": "processing",
            "Đã xác nhận thanh toán": "confirmed",
            "Đã giao hàng": "delivered",
            "Đã hủy": "canceled"
        };

        const result = orderData.reduce((acc, order) => {
            const statusKey = statusCount[order.status] || "other";
            acc[statusKey] = acc[statusKey] ? acc[statusKey] + 1 : 1;
            return acc;
        }, {});
        setOrderStats(result);  // Cập nhật lại orderStats
    };

    const getDataSalesData = async () => {
        const year = 2024; // Năm bạn muốn lấy dữ liệu
        const months = Array.from({ length: 12 }, (_, i) => {
            const month = String(i + 1).padStart(2, '0'); // Đảm bảo định dạng tháng (01, 02, ..., 12)
            return { month, from: `${year}-${month}-01`, to: `${year}-${month}-31` };
        });

        try {
            // Gửi nhiều yêu cầu cho từng tháng trong năm
            const promises = months.map(async ({ from, to }) => {
                const response = await AxiosInstance().get(`/api/order-details/analytics?from=${from}&to=${to}`);
                return response.data;
            });

            // Chờ tất cả các yêu cầu hoàn thành
            const allSalesData = await Promise.all(promises);

            // Kết hợp tất cả dữ liệu trả về
            const mergedSalesData = allSalesData.flat();

            // Duyệt qua các tháng và tạo dữ liệu cho các tháng không có dữ liệu
            const completeSalesData = months.map(({ month }) => {
                // Tìm dữ liệu của tháng hiện tại
                const monthData = mergedSalesData.find(data => data._id === `${year}-${month}`);

                if (monthData) {
                    return {
                        month,
                        totalQuantity: monthData.totalQuantity || 0,
                        totalPrice: monthData.totalPrice ? monthData.totalPrice.$numberDecimal : "0"
                    };
                } else {
                    // Nếu không có dữ liệu cho tháng này, trả về dữ liệu trống
                    return {
                        month,
                        totalQuantity: 0,
                        totalPrice: "0"
                    };
                }
            });

            // Cập nhật state với dữ liệu hoàn chỉnh
            setSalesData(completeSalesData);
        } catch (error) {
            console.error("Error fetching sales data:", error);
        }
    };

    const getTopSellingProducts = async () => {
        const response = await AxiosInstance().get(`/api/order-details/`);
        console.log('response 123', response);
        const groupedProducts = response.data.reduce((acc, product) => {
            const productId = product.product_id._id;
            if (!acc[productId]) {
                acc[productId] = {
                    name: product.product_id.name,
                    price: product.product_id.price, // Thêm giá vào object
                    id: product.product_id._id,
                    totalQuantity: 0,
                };
            }
            acc[productId].totalQuantity += product.quantity;
            return acc;
        }, {});
        console.log('favoriteProducts', groupedProducts);
        const sortedProducts = Object.values(groupedProducts)
            .sort((a, b) => b.totalQuantity - a.totalQuantity);
        setTopSellingProducts(sortedProducts.slice(0, 5));
    };

    useEffect(() => {
        getDataUsers();
        getDataProducts();
        getDataFavoriteProducts();
        getDataSalesData();
        getStatusOrder();
        getTopSellingProducts();
    }, []);

    // Chart Data for Sales Quantity and Revenue
    const chartData = {
        labels: salesData.map(item => item.month),  // Sử dụng month làm nhãn trục X
        datasets: [
            {
                label: 'Số lượng bán',
                data: salesData.map(item => item.totalQuantity),  // Số lượng bán
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',  // Màu cho số lượng bán
                tension: 0.1,
                yAxisID: 'y1'  // Gán trục Y riêng cho số lượng
            },
            {
                label: 'Doanh thu',
                data: salesData.map(item => item.totalPrice),  // Doanh thu
                fill: false,
                borderColor: 'rgba(255, 99, 132, 1)',  // Màu cho doanh thu
                tension: 0.1,
                yAxisID: 'y2'  // Gán trục Y riêng cho doanh thu
            }
        ]
    };

    // Chart Data for Order Status (with updated statuses)
    const pieChartData = {
        labels: [
            'Đặt hàng thành công',
            'Chờ thanh toán',
            'Đã xác nhận thanh toán',
            'Đang xử lý đơn hàng',
            'Đang vận chuyển',
            'Đã giao hàng',
            'Đã hủy'
        ],
        datasets: [
            {
                label: 'Trạng thái đơn hàng',
                data: [
                    orderStats.success,
                    orderStats.pending,
                    orderStats.confirmed,
                    orderStats.processing,
                    orderStats.shipping,
                    orderStats.delivered,
                    orderStats.canceled
                ],
                backgroundColor: [
                    '#32CD32', // Đặt hàng thành công
                    '#FFD700', // Chờ thanh toán
                    '#8A2BE2', // Đã xác nhận thanh toán
                    '#FFA500', // Đang xử lý đơn hàng
                    '#FF6347', // Đang vận chuyển
                    '#32CD32', // Đã giao hàng
                    '#FF0000'  // Đã hủy
                ],
                borderColor: '#ffffff',
                borderWidth: 1
            }
        ]
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
                                <i className="fa-home" ></i>
                                <a className="nav-link text-secondary" href="/">Bảng điều khiển</a>
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
                                <a className="nav-link text-white" href="/users">Tài khoản</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-white" onClick={() => saveUser(null)}>Đăng xuất</a>
                            </li>
                        </ul>
                    </div>
                </nav>

                {/* Main Content */}
                <div className="col-md-9 ms-sm-auto col-lg-10 px-4 py-4">
                    <div className="row">
                        {/* Total Users */}
                        <div className="col-12 col-md-4">
                            <div className="card mb-4 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">Tổng số người dùng</h5>
                                    <p className="card-text">{users.length}</p>
                                </div>
                            </div>
                        </div>

                        {/* Total Products */}
                        <div className="col-12 col-md-4">
                            <div className="card mb-4 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">Số sản phẩm hiện có</h5>
                                    <p className="card-text">{products.length}</p>
                                </div>
                            </div>
                        </div>

                        {/* Favorite Products */}
                        <div className="col-12 col-md-4">
                            <div className="card mb-4 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">Sản phẩm yêu thích</h5>
                                    <p className="card-text">{favoriteProducts.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sales and Order Status Charts (On the same row with 70/30 split) */}
                    <div className="row">
                        {/* Sales Chart */}
                        <div className="col-12 col-md-7 chart-left">
                            <div className="card shadow-sm mb-4">
                                <div className="card-body">
                                    <h5 className="card-title">Biểu đồ doanh thu bán hàng</h5>
                                    <Line data={chartData} />
                                </div>
                            </div>
                        </div>

                        {/* Order Status Pie Chart */}
                        <div className="col-12 col-md-5 chart-right">
                            <div className="card shadow-sm mb-4">
                                <div className="card-body">
                                    <h5 className="card-title">Trạng thái đơn hàng</h5>
                                    <Pie data={pieChartData} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Top Selling Products */}
                    <h4 className="mb-4">Top 3 Sản phẩm bán chạy</h4>
                    <table className="table table-hover table-striped">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">ID</th>
                                <th scope="col">Sản phẩm</th>
                                <th scope="col">Giá</th>
                                <th scope="col">Số lượng bán</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topSellingProducts.map((product, index) => (
                                <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{product.id}</td>
                                    <td>{product.name}</td>
                                    <td>{product.price}</td>
                                    <td>{product.totalQuantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default List;
