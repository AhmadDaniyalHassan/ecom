import Layout from '../components/layout/Layout.jsx'
import React, { useState, useEffect } from 'react'
import useCategory from '../hooks/useCategory.js'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'


const Categories = () => {
    const navigate = useNavigate()

    const categories = useCategory()

    return (
        <Layout title={'All-Categories'}>
            <button style={{ marginTop: 15, marginLeft: 15, marginBottom: 15 }} className='btn btn-primary' onClick={() => navigate(-1)}>Go Back</button>

            <div className="container">

                <div className="d-flex justify-content-center mt-3"> <span className="text text-center">Finding Best Products Now<br /> in Your Fingertips</span>
                </div>
                <div className="row mt-2 g-4">
                    <div className="col-md-3">
                        {categories?.map(c => (
                            <div className="card p-1" key={c._id}>
                                <div>
                                    <Link to={`/category/${c.slug}`} className="d-flex justify-content-between align-items-center p-2" >
                                        <div className="flex-column lh-1 imagename"> <b>{c.slug}</b> </div>
                                        <div> <img src="https://i.imgur.com/b9zkoz0.jpg" height={100} width={100} /> </div>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="col-md-3">
                        <div className="card p-2">
                            <div className="d-flex justify-content-between align-items-center p-2">
                                <div className="flex-column lh-1 imagename"> <b>Head</b> <b>Phones</b> </div>
                                <div> <img src="https://i.imgur.com/SHWASPG.png" height={100} width={100} /> </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>





        </Layout>
    )
}

export default Categories