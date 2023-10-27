import { useNavigate } from 'react-router-dom'
import React from 'react'
import { useSearch } from '../../context/search'
import axios from 'axios'

const SearchInput = () => {
    const navigate = useNavigate()
    const [values, setValues] = useSearch()

    const handleSubmitSearch = async (e) => {
        e.preventDefault()
        try {
            const { data } = await axios.get(`http://localhost:8000/api/product/search/${values.keyword}`)
            setValues({ ...values, results: data, keyword: '' })
            navigate(`/search/${values.keyword}`)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div>
            <form className="d-flex mx-5 search-bar-small" onSubmit={handleSubmitSearch}>
                <input className="form-control me-2"
                    type="search"
                    name='search'
                    placeholder="Search"
                    aria-label="Search"
                    value={values.keyword}
                    onChange={(e) => setValues({ ...values, keyword: e.target.value })} />
                <button style={{ fontSize: '.9rem', padding: '.3rem' }} className="btn btn-success" type="submit">Search</button>

            </form>
        </div>
    )
}

export default SearchInput