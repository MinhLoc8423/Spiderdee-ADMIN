import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import AxiosInstance from "../helper/AsioxInstance";
import swal from 'sweetalert';

const Edit = (props) => {
    const { id } = useParams();
    const { user } = props;

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [user_id, setUser_id] = useState(user?.ID);

    // doanh sách chủ đề 
    const [topics, setTopics] = useState([])
    useEffect(() => {
        const fetchTopics = async () => {
            const result = await AxiosInstance().get('/get-topics.php');
            setTopics(result);
        }
        fetchTopics();
    }, []);

    useEffect(() => {
        const fetchNews = async () => {
            const result = await AxiosInstance().get('/get-topics-detail.php?id=' + id);
            console.log(result);
            setName(result.name);
            setDescription(result.description);
        }
        fetchNews();
    }, [id])

    const handleEdit = async () => {
        swal({
            title: "Vui lòng xác nhận sửa",
            text: "Sửa dữ liệu vào hệ thông!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then(async (will) => {
                if (will) {
                    try {
                        if (!name || !description) {
                            swal("Vui lòng nhập đầy đủ thông tin");
                            return;
                        }

                        const body = {
                            name: name,
                            description: description,
                        }
                        console.log(body)
                        const result = await AxiosInstance().put("/update-topics.php?id=" + id, body);
                        console.log(result)
                        swal("Sửa thành công")
                        window.location.href = '/topic'
                    } catch (error) {
                        console.log(error)
                    }
                }
            });
    }

    return (
        // <div>
        //     <h1>Edit</h1>
        //     <form>
        //         <input type="text" value={title} onChange={(e)=> setTitle(e.target.value)} />
        //         <br />
        //         <input type="text" value={content} onChange={(e)=> setContent(e.target.value)} />
        //         <br />
        //         <input type="file" value={imageInput} onChange={handleImageChange} />
        //         <br />
        //         <img src={imagePerview} alt="" width={200} height={200} />
        //         <br />
        //         <select value={topic_id} onChange={(e)=> setTopic_id(e.target.value)}>
        //             {
        //                 topics.map((item, index) => (
        //                     <option value={item.id} key={index}>{item.name}</option>
        //                 ))
        //             }
        //         </select>
        //         <br />
        //         <button type="button" onClick={handleEdit}>Sửa</button>
        //     </form>
        // </div>
        <div className="container mt-5">
            <h1>Chỉnh sửa tin tức</h1>
            <form>
                {/* Ô input văn bản */}
                <div className="mb-3">
                    <label htmlFor="exampleText" className="form-label">Tiêu đề</label>
                    <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} id="exampleText" />
                </div>

                {/* Ô input email */}
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Nội dung</label>
                    <input type="text" className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>

                {/* Nút Submit */}
                <br/>
                <button type="button" class="btn btn-success btn-block"  onClick={handleEdit}>Sửa</button>
            </form>
        </div>
    )
}

export default Edit;