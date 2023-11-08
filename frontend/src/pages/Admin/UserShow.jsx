import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import AdminMenu from '../../components/layout/AdminMenu';
import axios from 'axios';
import { useAuth } from '../../context/auth';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const UserShow = () => {
  const [user, setUser] = useState([]);
  const [admin, setAdmin] = useState([]);
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const getAllUsers = async () => {
    try {
      const { data } = await axios.get('http://localhost:8000/api/user/get-user');
      setUser(data?.users);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllActiveAdmins = async () => {
    try {

      const loggedInAdminUserId = auth.user._id
      const { data } = await axios.get(`http://localhost:8000/api/user/get-active-admins/${loggedInAdminUserId}`);
      setAdmin(data?.users);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      const { data } = await axios.delete(`http://localhost:8000/api/user/delete-user/${userId}`);
      console.log(data);
      getAllUsers(); // Refresh the user list after deletion.
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggleAdmin = async (userId, isActive) => {
    try {
      // Send a request to toggle the admin's status based on their current status
      const response = await axios.put(`http://localhost:8000/api/user/toggle-admin/${userId}`);

      if (response.data.success) {
        // Update the local state to toggle the active status
        const updatedAdmins = admin.map((adminUser) =>
          adminUser._id === userId ? { ...adminUser, active: !isActive } : adminUser
        );
        setAdmin(updatedAdmins);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      getAllUsers(); getAllActiveAdmins()
    }
  }, [auth?.token]);

  return (
    <Layout title='Show Users'>
      <button style={{ marginTop: 15, marginLeft: 15, marginBottom: 15 }} className='btn btn-primary' onClick={() => navigate(-1)}>Go Back</button>

      <div className='container-fluid m-3 p-3'>
        <div className="row">
          <div className="col-md-2 margin-admin">
            <AdminMenu />
          </div>
          <div className='col-md-9'>
            <h2 className="text-center mb-0">All Users Information</h2>
            <h4 className='mb-1 mt-1 mb-2'>Admin Users</h4>
            {admin?.map((o, i) => (
              <div key={i} className='border shadow rounded'>
                <table className='table mb-0 table-dark'>
                  <thead>
                    <tr className='text-center '>
                      <th scope='col'>#</th>
                      <th scope='col'>Admin Name</th>
                      <th scope='col'>Admin Email</th>
                      <th scope='col'>Admin Address</th>
                      <th scope='col'>Admin Phone</th>
                      <th scope='col'>Created On</th>
                      <th scope='col'>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className='text-center'>
                      <td>{i + 1}</td>
                      <td>{o?.name}</td>
                      <td>{o?.email}</td>
                      <td>{o?.address}</td>
                      <td>{o?.phone}</td>
                      <td>{moment(o?.createAt).format("dddd, MMMM, Do, YYYY")}</td>
                      <td><button onClick={() => handleToggleAdmin(o._id, o.active)} className='btn btn-primary'>
                        {o.active ? 'Disable' : 'Enable'}
                      </button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
            <h4 className='mb-1 mt-1 mb-2'>Consumer Users</h4>
            {user?.map((o, i) => (
              <div key={i} className='border shadow rounded'>
                <table className='table table-dark mb-0'>
                  <thead>
                    <tr className='text-center'>
                      <th scope='col'>#</th>
                      <th scope='col'>User Name</th>
                      <th scope='col'>User Email</th>
                      <th scope='col'>User Address</th>
                      <th scope='col'>User Phone</th>
                      <th scope='col'>Created On</th>
                      <th scope='col'>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className='text-center'>
                      <td>{i + 1}</td>
                      <td>{o?.name}</td>
                      <td>{o?.email}</td>
                      <td>{o?.address}</td>
                      <td>{o?.phone}</td>
                      <td>{moment(o?.createAt).format("dddd, MMMM, Do, YYYY")}</td>
                      <td><button onClick={() => handleDelete(o._id)} className='btn btn-danger'>Delete</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserShow;
