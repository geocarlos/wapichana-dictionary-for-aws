import React from "react";
import axios from "axios";
import { API_FILE_UPLOAD_URL } from "../api/constants";
import { Button } from "@material-ui/core";
import { input } from "aws-amplify";

const FileUpload = () => {
    // fileToUpload contains the actual file object
    // uploadSuccess becomes true when the file upload is complete
    const [state, setState] = React.useState<any>({
        fileToUpload: undefined,
        uploadSuccess: undefined,
        error: undefined
    });

    const inputRef = React.useRef<any>();

    const uploadFile = () => {
        // When the upload file button is clicked, 
        // first we need to get the presigned URL
        // URL is the one you get from AWS API Gateway
        axios.get(`${API_FILE_UPLOAD_URL}/?filename=${state.fileToUpload.name}`)
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
                            uploadSuccess: "File upload successfull",
                            error: undefined
                        });
                    })
                    .catch(err => {
                        setState({
                            error: "Error Occured while uploading the file",
                            uploadSuccess: undefined
                        });
                    });
            });
    }

    const preview = (file: any) => {
        const src = window.URL.createObjectURL(file);
        if (file.type?.includes('image')) {
            return <img width="100" src={src} alt="preview" />
        }
        return <audio src={src} controls></audio>
    }

    return (
        <div style={{}}>
            <form>
                <div className="form-group">
                    <input
                        hidden
                        ref={inputRef}
                        type="file"
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
                            <Button
                                variant="outlined"
                                type="button"
                                size="small"
                                className="btn btn-light"
                                onClick={e => {
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
                            </Button>
                            <p>{inputRef && inputRef.current.files[0].name}</p>
                            {preview(inputRef.current.files[0])}
                        </>
                    ) : (
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => {
                                if (inputRef && inputRef.current) {
                                    inputRef.current.click();
                                }
                            }}>
                                Adicionar
                            </Button>
                        )}
                    <div>
                        <span>
                            {state.uploadSuccess
                                ? "File Upload Successfully"
                                : ""}
                        </span>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default FileUpload;