import React from 'react';
import SectionTitle from "../../components/SectionTitle";
import {useSelector} from "react-redux";

function Contact() {
    const {portfolioData} = useSelector((state) => state.root);
    const {contacts} = portfolioData;

    return (
        <div>
            <SectionTitle title="Say Hello"/>
            <div className="flex px-10 sm:flex-col items-center justify-between">
                <div className="flex flex-col gap-1">
                    <p className="text-white">{'{'}</p>
                    <p className="ml-5">
                        <span className="text-tertiary">Name : </span> : <span
                        className="text-tertiary">{contacts.name}</span>
                    </p>
                    <p className="ml-5">
                        <span className="text-tertiary">Age : </span> : <span
                        className="text-tertiary">{contacts.age}</span>
                    </p>
                    <p className="ml-5">
                        <span className="text-tertiary">Gender : </span> : <span
                        className="text-tertiary">{contacts.gender}</span>
                    </p>
                    <p className="ml-5">
                        <span className="text-tertiary">Email : </span> : <span
                        className="text-tertiary">{contacts.email}</span>
                    </p>
                    <p className="ml-5">
                        <span className="text-tertiary">Mobile : </span> : <span
                        className="text-tertiary">{contacts.mobile}</span>
                    </p>
                    <p className="ml-5">
                        <span className="text-tertiary">Address : </span> : <span
                        className="text-tertiary">{contacts.address}</span>
                    </p>
                    <p className="text-white">{'}'}</p>
                </div>
                <div className="h-[400px]">
                    <dotlottie-player
                        src="https://lottie.host/4927f289-d54f-4a1a-ac70-a22ba819e6a5/D7FBPMKgW2.json"
                        background="transparent"
                        speed="1"
                        direction="1"
                        playMode="normal"
                        loop=""
                        autoplay="">
                    </dotlottie-player>
                </div>
            </div>
        </div>
    );
}

export default Contact;