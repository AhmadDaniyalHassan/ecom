import React from 'react'
import facebook from '../../assets/facebook.png'
import whatsapp from '../../assets/whatsapp.png'
import instagram from '../../assets/instagram.png'
const Footer = () => {
    // &copy;
    return (
        <div>

            <div>
                {/* Footer */}
                <footer className="text-center text-lg-start text-dark mt-4" style={{ backgroundColor: '#D1D1D1' }}>
                    {/* Section: Social media */}
                    <section className="d-flex justify-content-between p-4 text-dark" style={{ backgroundColor: '#D1D1D1' }}>
                        {/* Left */}
                        <div className="me-5">
                            <span>Get connected with us on social networks:</span>
                        </div>
                        <section className="newsletter">
                            <div className="container">
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="content">
                                            <form>
                                                <h2>SUBSCRIBE TO OUR NEWSLETTER</h2>
                                                <div className="input-group">
                                                    <input name='email' type="email" className="form-control" autoComplete='on' placeholder="Enter your email" />
                                                    <span className="input-group-btn">
                                                        <button className="btn btn-secondary" type="submit">Subscribe Now</button>
                                                    </span>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        {/* Right */}
                        <div>
                            <img src={facebook} style={{ marginRight: '12px' }} width={'30px'} />
                            <img src={instagram} style={{ marginRight: '12px' }} width={'30px'} />
                            <img src={whatsapp} width={'30px'} />

                        </div>
                        {/* Right */}
                    </section>
                    {/* Section: Social media */}
                    {/* Section: Links  */}
                    <section>
                        <div className="container text-center text-md-start mt-5">
                            {/* Grid row */}
                            <div className="row mt-3">
                                {/* Grid column */}
                                <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                                    {/* Content */}
                                    <h6 className="text-uppercase fw-bold">Company name</h6>
                                    <hr className="mb-4 mt-0 d-inline-block mx-auto" style={{ width: 80, backgroundColor: '#000000', height: 2 }} />
                                    <p>
                                        Here you can use rows and columns to organize your footer
                                        content. Lorem ipsum dolor sit amet, consectetur adipisicing
                                        elit.
                                    </p>
                                </div>
                                {/* Grid column */}
                                {/* Grid column */}
                                <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
                                    {/* Links */}
                                    <h6 className="text-uppercase fw-bold">Products</h6>
                                    <hr className="mb-4 mt-0 d-inline-block mx-auto" style={{ width: 80, backgroundColor: '#000000', height: 2 }} />
                                    <p>
                                        <a href="#!" className="text-dark">MDBootstrap</a>
                                    </p>
                                    <p>
                                        <a href="#!" className="text-dark">MDWordPress</a>
                                    </p>
                                    <p>
                                        <a href="#!" className="text-dark">BrandFlow</a>
                                    </p>
                                    <p>
                                        <a href="#!" className="text-dark">Bootstrap Angular</a>
                                    </p>
                                </div>
                                {/* Grid column */}
                                {/* Grid column */}
                                <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                                    {/* Links */}
                                    <h6 className="text-uppercase fw-bold">Useful links</h6>
                                    <hr className="mb-4 mt-0 d-inline-block mx-auto" style={{ width: 80, backgroundColor: '#000000', height: 2 }} />
                                    <p>
                                        <a href="#!" className="text-dark">Your Account</a>
                                    </p>
                                    <p>
                                        <a href="#!" className="text-dark">Become an Affiliate</a>
                                    </p>
                                    <p>
                                        <a href="#!" className="text-dark">Shipping Rates</a>
                                    </p>
                                    <p>
                                        <a href="#!" className="text-dark">Help</a>
                                    </p>
                                </div>
                                {/* Grid column */}
                                {/* Grid column */}
                                <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
                                    {/* Links */}
                                    <h6 className="text-uppercase fw-bold">Contact</h6>
                                    <hr className="mb-4 mt-0 d-inline-block mx-auto" style={{ width: 80, backgroundColor: '#000000', height: 2 }} />
                                    <p><i className="fas fa-home mr-3" /> New York, NY 10012, US</p>
                                    <p><i className="fas fa-envelope mr-3" /> info@example.com</p>
                                    <p><i className="fas fa-phone mr-3" /> + 01 234 567 88</p>
                                    <p><i className="fas fa-print mr-3" /> + 01 234 567 89</p>
                                </div>
                                {/* Grid column */}
                            </div>
                            {/* Grid row */}
                        </div>
                    </section>
                    {/* Section: Links  */}
                    {/* Copyright */}
                    <div className="text-center p-3" style={{ backgroundColor: '#D1D1D1' }}>
                        © 2020 Copyright:
                        <a className="text-dark" href="https://mdbootstrap.com/">MDBootstrap.com</a>
                    </div>
                    {/* Copyright */}
                </footer>
                {/* Footer */}
            </div>
        </div>

    )
}

export default Footer