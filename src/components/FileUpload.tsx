import React from "react";
import axios from "axios";
import { API_FILE_UPLOAD_URL } from "../api/constants";
import { Button } from "@material-ui/core";
import Spinner from "./Spinner";

const FileUpload = ({handleAdd, type = 'image/*', width = 180, height = 35, children}: any) => {
    // fileToUpload contains the actual file object
    // uploadSuccess becomes true when the file upload is complete
    const [state, setState] = React.useState<any>({
        fileToUpload: undefined,
        uploadSuccess: undefined,
        error: undefined
    });

    const [loading, setLoading] = React.useState(false);

    const inputRef = React.useRef<any>();

    const uploadFile = () => {
        setLoading(true);
        const fileType = state.fileToUpload.type.substring(0, state.fileToUpload.type.indexOf('/'));
        const filename = state.fileToUpload.name;
        // When the upload file button is clicked, 
        // first we need to get the presigned URL
        // URL is the one you get from AWS API Gateway
        axios.get(`${API_FILE_UPLOAD_URL}/?filename=${fileType}/${filename}`)
            .then(response => {
                // Getting the url from response
                const url = response.data.fileUploadURL;

                // Initiating the PUT request to upload file    
                axios({
                    method: "PUT",
                    url: url,
                    data: state.fileToUpload,
                    headers: { "Content-Type": "multipart/form-data" }
                })
                    .then(res => {
                        setState({
                            uploadSuccess: "Arquivo enviado com sucesso!",
                            error: undefined
                        });
                        handleAdd(
                            fileType,
                            filename
                        );

                    })
                    .catch(err => {
                        setState({
                            error: "Ocorreu um erro ao enviar arquivo",
                            uploadSuccess: undefined
                        });
                    }).
                    finally(() => setLoading(false));
            });
    }

    const preview = (file: any) => {
        const src = window.URL.createObjectURL(file);
        if (file.type?.includes('image')) {
            return <img width={width} src={src} alt="preview" />
        }
        return <audio src={src} style={{width, height}} controls></audio>
    }

    return (
        <div style={{}}>
            <form>
                <div className="form-group">
                    <input
                        hidden
                        ref={inputRef}
                        type="file"
                        accept={type || 'image/*'}
                        className="form-control-file"
                        id="fileUpload"
                        onChange={(e: any) => {
                            setState({
                                fileToUpload: e.target.files[0]
                            });
                        }}
                    />
                    {state.fileToUpload ? (
                        <>
                            {!loading && <>
                            <Button
                                variant="outlined"
                                type="button"
                                size="small"
                                className="btn btn-light"
                                style={{marginRight: '0.5rem'}}
                                onClick={() => {
                                    uploadFile();
                                }}
                            >
                                Enviar
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                type="button"
                                color="secondary"
                                className="btn btn-light"
                                onClick={e => {
                                    setState({...state, fileToUpload: undefined});
                                }}
                            >
                                Cancelar
                            </Button></>}
                            <p>{inputRef && inputRef.current.files[0].name}</p>
                            {preview(inputRef.current.files[0])}
                        </>
                    ) : (
                            <Button
                                style={{background: 'white'}}
                                variant="outlined"
                                size="small"
                                onClick={() => {
                                if (inputRef && inputRef.current) {
                                    inputRef.current.click();
                                }
                            }}>
                                {children}
                            </Button>
                        )}
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                       {loading && <Spinner />}
                    </div>
                </div>
            </form>
        </div>
    );
}

export default FileUpload;