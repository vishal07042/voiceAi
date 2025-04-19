// import React, { useState } from 'react';
// import axios from 'axios';

// const MyForm = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     message: ''
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // axios.post('http://localhost:8000/api/api/', formData) 
//     axios.post('http://127.0.0.1:8000/api/contact/', formData)
//       .then(response => {
//         console.log('Data submitted successfully:', response.data);
//       })
//       .catch(error => {
//         console.error('There was an error!', error);
//       });
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
//       <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
//       <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Message" required />
//       <button type="submit">Submit</button>
//     </form>
//   );
// };

// export default MyForm;
