import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/certificate.css";
import Navbar from "./NavBar";
import certificate from "../img/certificates/Privacy-Planet-Certificate.png";

const Certificate = () => {
    const { planet } = useParams();
    const navigate = useNavigate();

    const handleDownload = () => {
        window.print();
    };

    const handleContinue = () => {
        navigate('/exploration-map');
    };

    return (
        <div className="certificate-container">
            <Navbar />
            <div className="certificate-content">
                <img src={certificate} alt="Certificate" />
            </div>
            <div className="certificate-buttons">
                <button onClick={handleDownload}>
                    DOWNLOAD CERTIFICATE
                </button>
                <button onClick={handleContinue}>
                    CONTINUE
                </button>
            </div>
        </div>
    );
};

export default Certificate;