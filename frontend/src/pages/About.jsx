import React from "react";
import Layout from "../components/layout/Layout";
import { useNavigate } from 'react-router-dom'

const About = () => {
    const navigate = useNavigate()

    return (
        <Layout title={"About us - Ecommer app"}>
            <button style={{ marginTop: 15, marginLeft: 15, marginBottom: 15 }} className='btn btn-primary' onClick={() => navigate(-1)}>Go Back</button>

            <div className="row contactus ">
                <div className="col-md-4 ">
                    <img
                        src="https://as1.ftcdn.net/v2/jpg/02/10/85/26/1000_F_210852662_KWN4O1tjxIQt8axc2r82afdSwRSLVy7g.jpg"
                        alt="contactus"
                        style={{ width: "100%" }}
                    />
                </div>
                <div className="col-md-5">
                    <h2 className="text-jsutify mt-2">About Us</h2>
                    <p className="text-justify mt-2">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus
                        officiis obcaecati esse tempore unde ratione, eveniet mollitia,
                        perferendis eius temporibus dicta blanditiis doloremque explicabo
                        quasi sunt vero optio cum aperiam vel consectetur! Laborum enim
                        accusantium atque, excepturi sapiente amet! Tenetur ducimus aut
                        commodi illum quidem neque tempora nam.
                    </p>
                </div>
            </div>
        </Layout>
    );
};

export default About;