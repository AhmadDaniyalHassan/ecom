import React from 'react'
import Layout from '../components/layout/Layout'
import { useSearch } from '../context/search'
import { Link } from 'react-router-dom'

const Search = () => {
    const [values, setValues] = useSearch();

    return (
        <Layout title={'Search Result'}>
            <div className='container'>
                <div className='text-center'>
                    <h2>Search Result</h2>
                    <h5>{values?.results.length < 1 ? 'No Product' : `Found ${values?.results.length} Product`}</h5>
                    <div style={{ justifyContent: 'center' }} className='d-flex flex-wrap mt-4'>
                        {values?.results.map((pdata) => (
                            <div className='card m-2 ' style={{ width: "15.0rem", height: '27rem', }} key={pdata._id}>
                                <img style={{ height: "12rem", width: "15.0rem", padding: '4px', borderRadius: 10, objectFit: "cover" }} src={pdata.image[0]} className='card-img-top' alt={pdata.name} />
                                <div className='card-body'>
                                    <h5 className='card-title'>{pdata.name}</h5>
                                    <p className='card-text'>{pdata.description.substring(0, 30)}...</p>
                                    <p className='card-text'><b>Price :</b> {pdata.price}</p>
                                    <p className='card-text'><b>Category :</b> {pdata?.category?.name}</p>
                                </div>
                                <div style={{ height: '4.5rem', width: '100%' }} className='card-footer d-flex flex-direction-row gap-2 p-3'>
                                    <button onClick={() => {
                                        setCart([...cart, pdata]);
                                        localStorage.setItem('cart', JSON.stringify([...cart, pdata]))
                                    }} className='btn btn-secondary' >Add to Cart</button>
                                    <Link to={`/single-product/${pdata.slug}`} className='btn btn-primary'>Details</Link>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </Layout>
    )
}

export default Search