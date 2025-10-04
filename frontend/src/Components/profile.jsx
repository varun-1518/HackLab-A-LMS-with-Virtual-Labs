import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import ImgUpload from "./ImgUpload";
import Performance from "./DashBoard/Performance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import Footer from "./header and footer/Footer";


function Profile() {
  const navigate = useNavigate();
  const authToken = localStorage.getItem("token");
   const id = localStorage.getItem("id");
  const [userDetails, setUserDetails] = useState(null);
  const [profileImage, setProfileImage] = useState(localStorage.getItem("profileImage") || "");



  useEffect(() => {
    if (!authToken) {
      navigate("/login");
    }

    async function fetchUserDetails() {
      try {
        const response = await fetch(
          `http://localhost:8080/api/users/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user details.");
        }
        const data = await response.json();
        console.log(data);
        setUserDetails(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchUserDetails();
  }, [authToken, navigate,id]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const imageData = e.target.result;
        localStorage.setItem("profileImage", imageData);
        setProfileImage(imageData);
      };

      reader.readAsDataURL(file);
    }
  };


  return (
    <div>
      <Navbar page={"profile"} />
      <div className="profile-card" id="pbg" style={{ marginTop: '3%', overflow: 'hidden', paddingBottom: '30px', maxHeight: '90vh', overflowY: 'auto' }}>
        <ImgUpload onChange={handleImageChange} src={profileImage} />
        <h2 className="profile-name">{userDetails?.username}</h2>
        
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', width: '80%', marginBottom: '15px' }}>
            <h4 style={{ width: '40%', textAlign: 'right', paddingRight: '15px', margin: '0' }}>Email: </h4>
            <p className="profile-email" style={{ width: '60%', textAlign: 'left', margin: '0' }}>{userDetails?.email}</p>
          </div>
          
          <div style={{ display: 'flex', width: '80%', marginBottom: '15px' }}>
            <h4 style={{ width: '40%', textAlign: 'right', paddingRight: '15px', margin: '0' }}>Phone Number: </h4>
            <p className="profile-phno" style={{ width: '60%', textAlign: 'left', margin: '0' }}>{userDetails?.phno}</p>
          </div>
          
          <div style={{ display: 'flex', width: '80%', marginBottom: '15px' }}>
            <h4 style={{ width: '40%', textAlign: 'right', paddingRight: '15px', margin: '0' }}>Gender: </h4>
            <p className="profile-gender" style={{ width: '60%', textAlign: 'left', margin: '0' }}>{userDetails?.gender}</p>
          </div>
          
          <div style={{ display: 'flex', width: '80%', marginBottom: '15px' }}>
            <h4 style={{ width: '40%', textAlign: 'right', paddingRight: '15px', margin: '0' }}>Date of Birth: </h4>
            <p className="profile-dob" style={{ width: '60%', textAlign: 'left', margin: '0' }}>{userDetails?.dob}</p>
          </div>
          
          <div style={{ display: 'flex', width: '80%', marginBottom: '15px' }}>
            <h4 style={{ width: '40%', textAlign: 'right', paddingRight: '15px', margin: '0' }}>Profession: </h4>
            <p className="profile-gender" style={{ width: '60%', textAlign: 'left', margin: '0' }}>{userDetails?.profession}</p>
          </div>
          
          <div style={{ display: 'flex', width: '80%', marginBottom: '15px' }}>
            <h4 style={{ width: '40%', textAlign: 'right', paddingRight: '15px', margin: '0' }}>Learning courses: </h4>
            <p className="profile-phno" style={{ width: '60%', textAlign: 'left', margin: '0' }}>{userDetails?.learningCourses.length}</p>
          </div>
        </div>
        
        <div
          style={{
            marginTop: '20px',
            marginBottom: '0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <a
            href={userDetails?.linkedin_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              marginRight: '20px',
              color: '#0077B5',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.3s ease',
            }}
            onMouseOver={(e) => e.target.style.color = '#004471'}
            onMouseOut={(e) => e.target.style.color = '#0077B5'}
          >
            <FontAwesomeIcon icon={faLinkedin} className="social-icon" style={{ fontSize: '25px' }} />
          </a>
          <a
            href={userDetails?.github_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#333',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.3s ease',
            }}
            onMouseOver={(e) => e.target.style.color = '#000'}
            onMouseOut={(e) => e.target.style.color = '#333'}
          >
            <FontAwesomeIcon icon={faGithub} className="social-icon" style={{ fontSize: '25px' }} />
          </a>
        </div>
      </div>
      <Performance />
      <Footer />
    </div>
  );
}

export default Profile;
