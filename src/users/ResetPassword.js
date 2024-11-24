import React, { useState, useEffect } from "react";
import AxiosInstance from "../helper/AsioxInstance";
import { useParams, useSearchParams } from "react-router-dom";

const ResetPassword = (props) => {
    // lấy 2 query params là token và email từ url 
    const [params, setParams] = useSearchParams();

    const [token, setToken] = useState(params.get('token'));
    const [email, setEmail] = useState(params.get('email'));
    const [password, setPassword] = useState('');
    const [password_confirmation, setPasswordConfirmation] = useState('');
    console.log(token, email);

    const [isValid, setIsValid] = useState(false);

    // check token và email có hợp lệ hay không
    useEffect(() => {
        const checkToken = async () => {
            try {
                const body = {
                    token: token,
                    email: email
                }
                const response = await AxiosInstance()
                    .post(`/check-reset-password.php`, body);
                setIsValid(response.status);
            } catch (error) {
                console.log(error);
            }
        }
        checkToken();
    }, [token, email]);

    // gửi request đổi mật khẩu
    const handleResetPassword = async () => {
        try {
            const body = {
                token: token,
                email: email,
                password: password,
                password_confirmation: password_confirmation
            }
            const response = await AxiosInstance()
                .post(`/reset-password.php`, body);
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }

    // nếu token và email hợp lệ thì hiển thị form đổi mật khẩu
    if (!email || !token || !isValid) {
        return (
            <div>
                <h1>404</h1>
            </div>
        )
    }

    return (
        <div>
            <h1>Reset Password</h1>
            <form>
                <div className="form-group">
                    <label>New Password</label>
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password" className="form-control" />
                </div>
                <div className="form-group">
                    <label>Confirm Password</label>
                    <input
                        value={password_confirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        type="password" className="form-control" />
                </div>
                <div className="form-group">
                    <button onClick={handleResetPassword} type="button" className="btn btn-primary">Submit</button>
                </div>
            </form>
        </div>
    )
}
export default ResetPassword;