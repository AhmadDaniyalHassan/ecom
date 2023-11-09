import Layout from '../components/layout/Layout.jsx'
import React, { useState, useEffect } from 'react'
import useCategory from '../hooks/useCategory.js'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import clothes from '../assets/clothes-category1.avif';
const Categories = () => {
    const images = [
        { id: 2, src: clothes, alt: 'clothes' },
    ];

    const navigate = useNavigate()

    const categories = useCategory()

    return (
        <Layout title={'All-Categories'}>
            <button style={{ marginTop: 15, marginLeft: 15, marginBottom: 15 }} className='btn btn-primary' onClick={() => navigate(-1)}>Go Back</button>

            <div className="container">

                <div className="row mt-2 g-4">
                    <h2 className='text-center'>Categories</h2>
                    {categories?.map(c => (
                        <div className="container flex d-flex flex-column align-items-center
                         justify-content-center">
                            <Link to={`/category/${c.slug}`} className="d-flex justify-content-between mb-6 text-light align-items-center p-2" >
                                <div className="card text-light border-0 shadow" style={{ maxWidth: '20em' }}>
                                    {images.map((image) => (
                                        <div key={image.id}>
                                            <img src={image.src} alt={c.slug} style={{ maxWidth: '20em' }} />
                                        </div>
                                    ))}
                                    <div className="card-img-overlay text-center">
                                        <h5 className="card-title fw-bold fs-1">{c.slug}</h5>
                                        <button className="btn btn-outline-light btn-sm rounded-0 mt-2">Shop Now</button>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>




        </Layout >
    )
}

export default Categories
{/* <div className="col-12 col-sm-8 col-md-6 col-lg-4">
<div className="card-body">
    <Link to={`/category/${c.slug}`} className="d-flex justify-content-between align-items-center p-2" >
    </Link>
</div> */}