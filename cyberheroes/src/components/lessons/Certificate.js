import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/certificate.css";
import Navbar from "../util/NavBar";
import TextReader from "../util/TextReader";

const Certificate = () => {
    const { planet } = useParams();
    const navigate = useNavigate();

    // Get the correct certificate image based on the planet
    const getCertificateImage = () => {
        const planetName = planet.toLowerCase().replace(/-/g, '-');
        return require(`../../img/certificates/${planetName}-certificate.png`);
    };

    const handleDownload = () => {
        window.print();
    };

    const handleContinue = () => {
        if (planet === 'privacy-planet') {
            navigate(`/privacy-planet/patrick-leaving`);
        } else {
            navigate('/exploration-map');
        }
    };

    return (
        <div>
            <Navbar />
            <TextReader />
            <div className="certificate-container readable-text">
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
        </div>
    );
};

export default Certificate;