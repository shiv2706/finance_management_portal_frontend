import React, {useEffect, useState} from "react";
import {Form, Upload, Button, message} from "antd";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import Loading from "../components/Loading";
import Success from "./Success";
import Failed from "./Failed";
import {form} from "framer-motion/m";

const UploadBillForm = () => {
    const navigate = useNavigate();
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    const onFileChange = ({file, fileList}) => {
        setFileList(
            fileList.map((file) => ({
                ...file,
                uid: file.uid || `${Date.now()}`, // Generate unique `uid` if missing
            }))
        );
    };
    const onFinish = async () => {
        if (!fileList.length) {
            message.error("Please upload a bill image.");
            return;
        }

        const formData = new FormData();
        formData.append("file", fileList[0].originFileObj);

        try {
            setLoading(true);
            const user = JSON.parse(localStorage.getItem("user"));
            let transactData = await axios.post("/transactions/upload-bill", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log(transactData);
            let rawData = transactData.data;
            let validJsonString = rawData.replace(/([a-zA-Z0-9_]+):/g, '"$1":') // Add double quotes around keys
                .replace(/(\w+):/g, '"$1":') // Ensure all keys are quoted
                .replace(/'([^']+)'/g, '"$1"');
            let jsonObject = JSON.parse(validJsonString);
            await axios.post("/transactions/add-transaction", {...jsonObject,userid:user._id, })
            setLoading(false);
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
            }, 3000)

            console.log(jsonObject);

            message.success("Bill uploaded successfully!");
        } catch (error) {
            setLoading(false);
            setError(true);
            setTimeout(() => {
                setError(false);
            }, 2000)
            console.log(error);
            message.error("Failed to upload bill. Please try again.");
        }
    };
    return (
        <Form layout="vertical" onFinish={onFinish}>
            {/* File Upload */}
            {loading && <Loading/>}
            {success && <Success/>}
            {error && <Failed />}
            <Form.Item
                name="file"
                rules={[{required: true, message: "Please upload a file."}]}
            >
                <Upload
                    beforeUpload={() => false} // Prevent auto-upload
                    onChange={onFileChange}
                    fileList={fileList}
                    accept="image/*">
                    <Button>
                        <h8>Upload Image</h8>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             className="bi bi-cloud-upload" viewBox="0 0 16 16">
                            <path fill-rule="evenodd"
                                  d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383"/>
                            <path fill-rule="evenodd"
                                  d="M7.646 4.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V14.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708z"/>
                        </svg>
                    </Button>
                </Upload>
            </Form.Item>
            <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-primary">SAVE</button>
            </div>
        </Form>
    )
}

export default UploadBillForm;