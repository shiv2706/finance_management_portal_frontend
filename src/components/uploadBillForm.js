import React, {useEffect, useState} from "react";
import {Form, Upload, Button, message} from "antd";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import Loading from "../components/Loading";
import Success from "./Success";
import UploadProgress from "./UploadProgress";
import Failed from "./Failed";
import ExtractingText from "./ExtractingText";
import CategorizingData from "./CategorizingData";


const UploadBillForm = () => {
    const navigate = useNavigate();
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [extractingText, setExtractingText] = useState(false);
    const [categorizingData, setCategorizingData] = useState(false);
    const [error, setError] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showprogressBar, setShowprogressBar] = useState(false);

    const captureImage = async () => {
        try {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.capture = "environment"; // Opens the camera in back mode on mobile

            input.onchange = (event) => {
                const file = event.target.files[0];
                if (file) {
                    setFileList([{ uid:`${Date.now()}`, name: file.name, originFileObj: file }]);
                }
            };

            input.click(); // Trigger camera
        } catch (error) {
            console.error("Error capturing image:", error);
            message.error("Failed to capture image.");
        }
    };

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
            setShowprogressBar(true);
            setLoading(true);
            setProgress(0)
            setTimeout(() => {
                setProgress(10)
            }, 1000)
            const user = JSON.parse(localStorage.getItem("user"));
            setTimeout(() => {
                setProgress(25)
            }, 2000)
            setTimeout(() => {
                setProgress(35)
            }, 4000)
            setExtractingText(true);
            const transactData = await axios.post("/transactions/upload-bill", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log(transactData);
            setProgress(50)
            setExtractingText(false);
            setCategorizingData(true)
            setTimeout(() => {
                setProgress(70)
            }, 1000)
            let categorizedData = await axios.post("/transactions/category-extract", {transactData:transactData.data});
            let rawData = categorizedData.data;
            let validJsonString = rawData.replace(/([a-zA-Z0-9_]+):/g, '"$1":') // Add double quotes around keys
                .replace(/(\w+):/g, '"$1":') // Ensure all keys are quoted
                .replace(/'([^']+)'/g, '"$1"');
            let jsonObject = JSON.parse(validJsonString);
            setProgress(90)
            await axios.post("/transactions/add-transaction", {...jsonObject,userid:user._id, })
            setLoading(false);
            setCategorizingData(false)
            setProgress(100)
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                setProgress(0)
                setShowprogressBar(false);
            }, 3000)

            console.log(jsonObject);

            message.success("Bill uploaded successfully!");
        } catch (error) {
            setShowprogressBar(false);
            setProgress(0)
            setLoading(false);
            setCategorizingData(false)
            setExtractingText(false);
            setError(true);
            setTimeout(() => {
                setError(false);
            }, 2000)
            console.log(error);
            message.error("Failed to upload bill. Please try again.");
        }
    };
    return (
        <Form className="imgForm" layout="vertical" onFinish={onFinish}>
            {/* File Upload */}
            {extractingText && <ExtractingText/>}
            {categorizingData && <CategorizingData/>}
            {/*{loading && <Loading/>}*/}
            {success && <Success/>}
            {showprogressBar && <UploadProgress value={progress}/>}
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="16" fill="currentColor"
                             className="bi bi-cloud-upload" viewBox="0 0 16 16">
                            <path fill-rule="evenodd"
                                  d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383"/>
                            <path fill-rule="evenodd"
                                  d="M7.646 4.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V14.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708z"/>
                        </svg>
                    </Button>
                </Upload>
            </Form.Item>
            <Button onClick={captureImage} style={{marginTop:0}}>
                Capture Image <svg xmlns="http://www.w3.org/2000/svg" width="15" height="16" fill="currentColor"
                                   className="bi bi-camera" viewBox="0 0 16 16">
                <path
                    d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4z"/>
                <path
                    d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5m0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/>
            </svg>
            </Button>


            <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-primary">SAVE</button>
            </div>
        </Form>
    )
}

export default UploadBillForm;