import React from "react";
import "../styles/about.css";
import { useNavigate } from "react-router-dom";
import Navbar from "./util/NavBar";
import TextReader from "./util/TextReader";
import Matthew from "../img/about-us/Matthew-Chung.png";
import Ysabelle from "../img/about-us/Ysabelle-Olairez.png";
import Vincent from "../img/about-us/Vincent-Kao.png";
import Kyla from "../img/about-us/Kyla-Olitoquit.png";
import Olivia from "../img/about-us/Olivia-Sapp.png";
import Viru from "../img/about-us/Viru-Repalle.png";

const AboutPage = () => {
    const navigate = useNavigate();

    return (
        <div>
            <Navbar />
            <TextReader />
            <div className="about-container readable-text">
                    <div className="about-text-container">
                        <h1 className="about-header">
                            Meet The Team
                        </h1>
                        <h2 className="about-text">
                            Hi! We are a team of 5 Informatics students at the University of Washington. 
                            Cyberheroes is our sponsored capstone project—a fun and educational platform designed to teach 3rd and 4th 
                            graders about cybersecurity and safe online habits. 
                        </h2>
                        <h2 className="about-text">
                            Click on our pictures to connect with us!
                        </h2>
                    </div>
                    <div className="about-image-container">
                        <div className="about-Matthew about-person">
                            <img src={Matthew} alt="Matthew" className="about-image"
                            onClick={() => window.open('https://www.linkedin.com/in/matthewchung-/', '_blank')}/>
                            <p className="name-text">Matthew Chung</p>
                            <p className="role-text">Data</p>
                        </div>
                        <div className="about-Vincen about-person">
                            <img src={Vincent} alt="Vincent" className="about-image"
                            onClick={() => window.open('https://www.linkedin.com/in/vincent-kao-hck/', '_blank')}/>
                            <p className="name-text">Vincent Kao</p>
                            <p className="role-text">Backend Developer</p>
                        </div>
                        <div className="about-Ysabelle about-person">
                            <img src={Ysabelle} alt="Ysabelle" className="about-image"
                            onClick={() => window.open('https://www.linkedin.com/in/ysabellelara/', '_blank')}/>
                            <p className="name-text">Ysabelle Olairez</p>
                            <p className="role-text">UX Designer /</p>
                            <p className="role-text">Researcher</p>
                        </div>
                        <div className="about-Kyla about-person">
                            <img src={Kyla} alt="Kyla" className="about-image"
                            onClick={() => window.open('https://www.linkedin.com/in/kyla-olitoquit-b07184226/', '_blank')}/>
                            <p className="name-text">Kyla Olitoquit</p>
                            <p className="role-text">UX / Product Manager</p>
                        </div>
                        <div className="about-Olivia about-person">
                            <img src={Olivia} alt="Olivia" className="about-image"
                            onClick={() => window.open('https://www.linkedin.com/in/olivia-sapp/', '_blank')}/>
                            <p className="name-text">Olivia Sapp</p>
                            <p className="role-text">Software Engineer</p>
                        </div>
                        <div className="about-Viru about-person">
                            <img src={Viru} alt="Viru" className="about-image"
                            onClick={() => window.open('https://www.linkedin.com/in/viru-repalle-434120264/', '_blank')}/>
                            <p className="name-text">Viru Repalle</p>
                            <p className="role-text">Sponsor</p>
                        </div>
                    </div>
            </div>
        </div>
    );
};

export default AboutPage;
