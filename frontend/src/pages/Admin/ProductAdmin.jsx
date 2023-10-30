import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/layout/AdminMenu.jsx";
import Layout from "../../components/layout/Layout.jsx";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom'

const ProductAdmin = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate()

    // Get all products
    const getAllProducts = async () => {
        try {
            const { data } = await axios.get("http://localhost:8000/api/product/get-product");
            setProducts(data?.product);
        } catch (error) {
            console.log(error);
        }
    };

    // Lifecycle method
    useEffect(() => {
        getAllProducts();
    }, []);

    const handleDelete = async (productId) => {
        try {
            const { data } = await axios.delete(`http://localhost:8000/api/product/delete-product/${productId}`);
            console.log(data);
            getAllProducts();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Layout>
            <button style={{ marginTop: 15, marginLeft: 15, marginBottom: 15 }} className='btn btn-primary' onClick={() => navigate(-1)}>Go Back</button>

            <div className='container-fluid m-3 p-3'>
                <div className="row">
                    <div className="col-md-2 margin-admin">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <h3 className="text-center">All Products Controller</h3>
                        <div className="d-flex justify-content-start flex-direction-row flex-wrap p-2">
                            {products?.map((product) => (
                                <div key={product._id} className="card m-1 card-admin" style={{ width: "15.0rem", height: '22.5rem' }}>
                                    <img
                                        style={{ width: "14rem", height: "10rem", padding: '4px', borderRadius: 10, objectFit: "cover" }}
                                        src={product.image[0]}
                                        className="card-img-top"
                                        alt={product.name}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title mb-1"><b>Name: </b>{product.name}</h5>
                                        <p className="card-text mb-1"><b>Info: </b>{product?.description}</p>
                                        <p className='card-text mb-1'><b>Price: </b> {product?.price}</p>
                                        <p className='card-text mb-1'><b>Category: </b> {product?.category?.name}</p>
                                    </div>
                                    <div className="card-footer d-flex flex-direction-row p-2" >
                                        <Link
                                            style={{ textDecoration: "none" }}
                                            to={`/dashboard/admin/update-product/${product.slug}`}
                                        >
                                            <button style={{ marginLeft: '4px', marginRight: "10px" }} className="btn btn-primary">Edit</button>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product._id)}

                                            className="btn btn-danger"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ProductAdmin;
