import React from 'react'
import Layout from "../components/layout/Layout"
import { Link } from 'react-router-dom'

const PageNotFount = () => {
    return (
        <Layout>
            <div className='pnf'>
                <h2 className='pnf-title'>404</h2>
                <h3 className='pnf-heading'>Error! Page Not Found</h3>
                <Link className='pnf-btn' to={'/'}>&rarr; Go to Home Page</Link>
            </div>
        </Layout>
    )
}

export default PageNotFount