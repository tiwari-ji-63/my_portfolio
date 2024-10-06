import React, {useEffect, useState} from "react";
import Header from "../../components/Header";
import Introduction from "./Introduction";
import About from "./About";
import Experiences from "./Experiences";
import Project from "./Project";
import Certificate from "./Certificate";
import Skill from "./Skill";
import Contact from "./Contact";
import Footer from "./Footer";
import LeftSider from "./LeftSider";
import Education from "./Education";
import {useSelector} from "react-redux";

function Home() {
    const {portfolioData} = useSelector((state) => state.root);
    const [showButton, setShowButton] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({top: 0, behavior: "smooth"});
    };

    const handleScroll = () => {
        setShowButton(window.scrollY > window.innerHeight);
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div>
            <Header/>
            {portfolioData && (<div className="bg-primary px-40 sm:px-5">
                <Introduction/>
                <About/>
                <Skill/>
                <Experiences/>
                <Project/>
                <Education/>
                <Certificate/>
                <Contact/>
                <Footer/>
                <LeftSider/>
                {showButton && (
                    <button
                        onClick={scrollToTop}
                        className="fixed right-4 bottom-4 bg-tertiary p-2 rounded-full hover:bg-opacity-80"
                    >
                        <i className="ri-arrow-up-line text-2xl"></i>
                    </button>
                )}
            </div>)}
        </div>
    );
}

export default Home;