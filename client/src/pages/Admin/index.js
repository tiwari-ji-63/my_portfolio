import React, {useEffect} from 'react'
import Header from "../../components/Header";
import {Tabs} from 'antd';
import AdminHeader from "./AdminHeader";
import AdminIntro from "./AdminIntro";
import AdminAbout from "./AdminAbout";
import {useSelector} from "react-redux";
import AdminExperiences from "./AdminExperiences";
import AdminProjects from "./AdminProjects";
import AdminSkills from "./AdminSkills";
import AdminEducation from "./AdminEducation";
import AdminCertificates from "./AdminCertificates";
import AdminLeftSider from "./AdminLeftSider";
import AdminContact from "./AdminContact";
import AdminFooter from "./AdminFooter";

const {TabPane} = Tabs;

function Admin() {
    const {portfolioData} = useSelector((state) => state.root);

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            window.location.href = "/admin-login";
        }
    }, []);

    return (
        <div className="bg-green-100 ">
            <Header/>
            <div className='flex gap-10 items-center px-5 py-14 justify-between'>
                <div className="flex gap-10 items-center sm:gap-5">
                    <h1 className="text-3xl text-primary sm:text-xl">Portfolio Admin</h1>
                    <div className="h-[2px] w-60 bg-gray-500 sm:w-20"></div>
                </div>
                <h1 className="underline text-primary text-xl cursor-pointer py-10" onClick={() => {
                    localStorage.removeItem("token");
                    window.location.href = "/admin-login";
                }}
                >Logout</h1>
            </div>
            {portfolioData && <div className="px-5 pb-10">
                <Tabs defaultActiveKey="2">
                    <TabPane tab="Header" key="1">
                        <AdminHeader/>
                    </TabPane>
                    <TabPane tab="Intro" key="2">
                        <AdminIntro/>
                    </TabPane>
                    <TabPane tab="About" key="3">
                        <AdminAbout/>
                    </TabPane>
                    <TabPane tab="Skills" key="4">
                        <AdminSkills/>
                    </TabPane>
                    <TabPane tab="Experiences" key="5">
                        <AdminExperiences/>
                    </TabPane>
                    <TabPane tab="Projects" key="6">
                        <AdminProjects/>
                    </TabPane>
                    <TabPane tab="Education" key="7">
                        <AdminEducation/>
                    </TabPane>
                    <TabPane tab="Certificates" key="8">
                        <AdminCertificates/>
                    </TabPane>
                    <TabPane tab="Social media link " key="9">
                        <AdminLeftSider/>
                    </TabPane>
                    <TabPane tab="Contact" key="10">
                        <AdminContact/>
                    </TabPane>
                    <TabPane tab="Footer" key="11">
                        <AdminFooter/>
                    </TabPane>
                </Tabs>
            </div>}
        </div>
    );
}

export default Admin