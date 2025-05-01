import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/certificate.css";
import Navbar from "./NavBar";

const Certificate = () => {
    const { planet } = useParams();
    const navigate = useNavigate();

    // Get the correct certificate image based on the planet
    const getCertificateImage = () => {
        const planetName = planet.toLowerCase().replace(/-/g, '-');
        return require(`../img/certificates/${planetName}-certificate.png`);
    };

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
                <img src={getCertificateImage()} alt={`${planet} Certificate`} />
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