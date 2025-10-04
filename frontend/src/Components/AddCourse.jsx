import React, { useState } from 'react';
import {useNavigate } from 'react-router-dom';

function AddCourse() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    course_name: '',
    instructor: '',
    price: '',
    description: '',
    y_link: '',
    p_link: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convert price to number
    const courseData = {
      ...formData,
      price: parseInt(formData.price)
    };
    
    console.log("Sending course data:", courseData);

    try {
      const response = await fetch('http://localhost:8080/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });

      console.log("Response status:", response.status);
      
      if (response.ok) {
        console.log('Course Added successfully!');
        navigate("/courses");
      } else {
        try {
          const data = await response.json();
          setError(data.error || "Failed to add course");
          console.error("Error response:", data);
        } catch (err) {
          console.error("Error parsing response:", err);
          const text = await response.text();
          console.error("Raw error response:", text);
          setError(`Server error: ${response.status}`);
        }
      }
    } catch (error) {
      console.error('Course add error:', error);
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className='add'>
      <div className='container1'>
        <h2>Course Registration</h2>
        <form onSubmit={handleSubmit} className="addCourse-form">
          <label>Name : </label>
          <input type="text" name="course_name" value={formData.course_name} onChange={handleChange} required style={{width:"100%"}}/>
          
          <label>instructor : </label>
          <input type="text" name="instructor" value={formData.instructor} onChange={handleChange} required style={{width:"100%"}}/>
          
          <label>price : </label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} required style={{width:"100%"}}/>
          
          <label>description : </label>
          <input type="text" name="description" value={formData.description} onChange={handleChange} required style={{width:"100%"}}/>
          
          <label>Video Link : </label>
          <input type="text" name="y_link" value={formData.y_link} onChange={handleChange} required style={{width:"100%"}}/>
          
          <label>Image Link : </label>
          <input type="text" name="p_link" value={formData.p_link} onChange={handleChange} required style={{width:"100%"}}/>
          
          {error && <span className='error-msg' style={{color: 'red', display: 'block', margin: '10px 0'}}>{error}</span>}
          
          <div className='btn1'><button type="submit">Add Course</button></div>
        </form>
      </div>
    </div>
  );
}

export default AddCourse;
