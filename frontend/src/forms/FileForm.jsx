import React, {Component} from 'react';
import axios from "axios";

const FileForm = ({responseType, onSuccess}) => {
    const [file, setFile] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState(false);

    const handleFile = (e) => {
        setFile(e.target.files[0]);
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        setIsLoading(true);
        let formDate = new FormData();
        formDate.append("file", file);
        await axios.post('http://localhost:8000/api/predict/file/', formDate, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                params: {
                    response_type: responseType.value,
                },
                responseType: responseType.value === 'file' ? 'blob' : 'json',
            })
                .then((response) => {
                    onSuccess(response)
                    setError(null);
                })
                .catch(e => {
                    console.log(e)
                    setError(e.response.data.file || e.response.data || 'Ошибка')
                })
                .finally(() => setIsLoading(false));
    }

    return (
        <form action='' className='form' onSubmit={handleSubmit}>
            <input className="input" type="file" id="file" onChange={handleFile}/>

            <input className="button" type="submit" value={isLoading ? "Загрузка..." : "Отправить"}/>

            {error && <div className="alert alert-danger">{error}</div>}
        </form>
    );
}

export default FileForm;
