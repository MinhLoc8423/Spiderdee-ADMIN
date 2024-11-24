import React, { useState } from 'react';
import AxiosInstance from '../helper/AsioxInstance';
import AsyncStorage from '@react-native-async-storage/async-storage'
import "./Login.css"

const Login = (props) => {
    const { saveUser } = props;
    const [email, setEmail] = useState("admin-loc@spiderdee.vn");
    const [password, setPassword] = useState("Locvtvn123");


    const login = async () => {
        try {
            const body = { email, password };
            console.log(body);
            const result = await AxiosInstance().post('/auth/login', body);
            console.log(result);
            if (result.status) {
                await AsyncStorage.setItem('token', result.data.token)
                saveUser(result)
            }
            else {
                alert("Đăng nhập thất bại");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        // <form>
        //     <div className='mb-3 mt-3'>
        //         <label className='form-label'>Email:</label>
        //         <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} className='form-control' placeholder='Enter email' name='email'></input>
        //     </div>
        //     <div className='mb-3 mt-3'>
        //         <label className='form-label'>Password:</label>
        //         <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} className='form-control' placeholder='Enter password' name='pswd'></input>
        //     </div>
        //     <button  type='button' onClick={login} className='btn btn-primary'>Submit</button>
        // </form>
        <section class="vh-100">
            <div class="container-fluid h-custom">
                <div class="row d-flex justify-content-center align-items-center h-100">
                    <div class="col-md-9 col-lg-6 col-xl-5">
                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                            class="img-fluid" alt="Sample image" />
                    </div>
                    <div class="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                        <form>
                            <div class="divider d-flex align-items-center my-4">
                                <p class="text-center fw-bold mx-3 display-7 mb-0">Đăng nhập</p>
                            </div>

                            {/* <!-- Email input --> */}
                            <div class="form-outline mb-4">
                                <input type="email" id="form3Example3" value={email} onChange={(e) => setEmail(e.target.value)} class="form-control form-control-lg"
                                    placeholder="Enter a valid email address" />
                            </div>

                            {/* <!-- Password input --> */}
                            <div class="form-outline mb-3">
                                <input type="password" id="form3Example4" value={password} onChange={(e) => setPassword(e.target.value)} class="form-control form-control-lg"
                                    placeholder="Enter password" />
                            </div>

                            <div class="d-flex justify-content-between align-items-center">
                                {/* <!-- Checkbox --> */}
                                <div class="form-check mb-0">
                                    <input class="form-check-input me-2" type="checkbox" value="" id="form2Example3" />
                                    <label class="form-check-label" for="form2Example3">
                                        Ghi nhớ tài khoản
                                    </label>
                                </div>
                                <a href="#!" class="text-body">Quên mật khẩu</a>
                            </div>

                            <div class="text-center mt-4 pt-2">
                                <button type="button" class="btn btn-primary btn-lg w-100" onClick={login}>Login</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Login;