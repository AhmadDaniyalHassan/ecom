import React from 'react'
import Layout from "../components/layout/Layout"
import { useWishlist } from '../context/wishlist'

const Wishlist = () => {
    const [wishlist, setWishlist] = useWishlist()

    return (
        <Layout title={"Wishlist - Ecom"}>
            {JSON.stringify(wishlist, null, 4)}
        </Layout>
    )
}

export default Wishlist