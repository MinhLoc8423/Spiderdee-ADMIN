import React, {useEffect, useState} from "react";
import AxiosInstance from "../helper/AsioxInstance";
import swal from 'sweetalert';

const Add = (props) => {
    const { user } = props;
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [user_id, setUser_id] = useState(user.user?.ID);

    
    // doanh sách chủ đề 
    const [topics, setTopics] = useState([])
    useEffect(() => {
        const fetchTopics = async () => {
            const result = await AxiosInstance().get('/get-topics.php');
            setTopics(result);
            console.log(result)
        }
        fetchTopics();
    }, []);

    const handleAdd = async () => {
        swal({
            title: "Vui lòng xác nhận thêm mới",
            text: "Thêm dữ liệu vào hệ thông!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
        .then(async (will) => {
            if(will) {
                try {
                    if(!name || !description){
                        swal("Vui lòng nhập đầy đủ thông tin");
                        return;
                    }
        
                    const body = {
                        name: name,
                        description: description,
                    }
                    const result = await AxiosInstance().post("/add-topics.php", body);
                    console.log(result)
                    swal("Thêm thành công")
                    window.location.href = '/topic'
                } catch (error) {
                    console.log(error)
                }
            }
        });
    }

    return (
        <div>
            {/* <form>
                <input type="text" value={title} onChange={(e)=> setTitle(e.target.value)} />
                <br />
                <input type="text" value={content} onChange={(e)=> setContent(e.target.value)} />
                <br />
                <input type="file" value={imageInput} onChange={handleImageChange} />
                <br />
                <img src={imagePerview} alt="" width={200} height={200} />
                <br />
                <select value={topic_id} onChange={(e)=> setTopic_id(e.target.value)}>
                    {
                        topics.map((item, index) => (
                            <option value={item.id} key={index}>{item.name}</option>
                        ))
                    }
                </select>
                <br />
                <button type="button" onClick={handleAdd}>Thêm</button>
            </form> */}
            <div className="container mt-5">
            <h1>Thêm tin tức</h1>
            <form>
                {/* Ô input văn bản */}
                <div className="mb-3">
                    <label htmlFor="exampleText" className="form-label">Tên</label>
                    <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} id="exampleText" />
                </div>

                {/* Ô input email */}
                <div className="mb-3">
                    <label htmlFor="exampleText" className="form-label">Mô tả</label>
                    <input type="text" className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                {/* Nút Submit */}
                <br/>
                <button type="button" class="btn btn-success btn-block"  onClick={handleAdd}>Thêm</button>
            </form>
        </div>
        </div>
    )
}

export default Add;