import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import b1 from "./images/b1.jpg"; // Network Security
import b2 from "./images/b2.jpg"; // Ethical Hacking
import b3 from "./images/b3.jpg"; // Web Security
import b4 from "./images/b4.png"; // Malware Analysis
import Footer from "./header and footer/Footer";

function Courses() {

  const [courses, setCourses] = useState([]);
  const userId = localStorage.getItem("id");
  const navigate = useNavigate();
  const[enrolled , SetEnrolled] = useState([]);
  const authToken = localStorage.getItem('token');
  
  // Map of course images by category
  const courseImages = {
    network: b1,
    hacking: b2,
    web: b3,
    malware: b4
  };
  
  // Function to select an appropriate image based on course name
  const getImageForCourse = (courseName, courseDesc) => {
    const name = (courseName + " " + (courseDesc || "")).toLowerCase();
    
    if (name.includes("network") || name.includes("infrastructure")) 
      return courseImages.network;
    else if (name.includes("hack") || name.includes("penetration") || name.includes("ethical"))
      return courseImages.hacking;
    else if (name.includes("web") || name.includes("application"))
      return courseImages.web;
    else if (name.includes("malware") || name.includes("forensic") || name.includes("analysis"))
      return courseImages.malware;
    else
      return courseImages.network; // default
  };

  useEffect(() => {
    fetch("http://localhost:8080/api/courses")
      .then((response) => response.json())
      .then((data) => {
        // Display all courses instead of filtering
        setCourses(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
      const userId = localStorage.getItem("id");
      if(userId){
        fetch(`http://localhost:8080/api/learning/${userId}`)
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            let arr = [];
            for (let i=0;i<data.length ;i++){
              arr.push(data[i].course_id);
            }
            SetEnrolled(arr);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
        }
  }, []);

  const handleCourseDetails = (course) => {
    // Navigate to course details
    navigate(`/course/${course.course_id}`);
  };

  function enrollCourse(courseId, event) {
    event.stopPropagation(); // Prevent the parent click event from triggering
    
    if(authToken){
      const enrollRequest = {
        userId: userId,
        courseId: courseId
     };
      axios.post('http://localhost:8080/api/learning', enrollRequest)
          .then((response) => {
            if(response.data === "Enrolled successfully"){
              toast.success('Course Enrolled successfully', {
                position: 'top-right',
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
              });
              // Add the course to enrolled courses
              SetEnrolled([...enrolled, courseId]);
              setTimeout(()=>{
                navigate(`/course/${courseId}`);
              },2000);
            } else if (response.data === "Course already enrolled") {
              toast.info('You are already enrolled in this course', {
                position: 'top-right',
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
              });
              navigate(`/course/${courseId}`);
            }
          })
          .catch((error) => {
              console.error('Enrollment error:', error);
              toast.error('Error enrolling in course', {
                position: 'top-right',
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
              });
          });
    } else {
      toast.error('You need to login to continue', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      });
      setTimeout(()=>{
        navigate('/login');
      },2000);
    }
 }


return (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Navbar page={"courses"}/>
    <div style={{ flex: 1 }}>
      <div className="cybersecurity-banner" style={{
        backgroundColor: "#003366",
        color: "white",
        padding: "20px",
        textAlign: "center",
        margin: "0 0 20px 0",
        backgroundImage: "linear-gradient(to right, #001a33, #003366, #001a33)",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"
      }}>
        <h2 style={{ color: "white", fontSize: "28px", fontWeight: "700", marginBottom: "10px" }}>
          All Available Courses
        </h2>
        <p style={{ color: "white", fontSize: "16px" }}>
          Browse our complete catalog of courses and start learning today
        </p>
      </div>
      <div className="courses-container" style={{marginTop :"20px"}}>
        {courses.length > 0 ? (
          courses.map((course) => (
            <div 
              key={course.course_id} 
              className="course-card" 
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
                minHeight: '400px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                borderRadius: '12px',
                background: '#fff',
                padding: '0',
                position: 'relative'
              }}
              onClick={() => handleCourseDetails(course)}
            >
              <img 
                src={course.p_link || getImageForCourse(course.course_name, course.description)} 
                alt={course.course_name} 
                className="course-image"
                style={{ 
                  width: "100%", 
                  height: "180px", 
                  objectFit: "cover",
                  borderBottom: "2px solid #003366"
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getImageForCourse(course.course_name, course.description);
                }}
              />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', padding: '20px', paddingBottom: 0 }}>
                <h3 className="course-heading" style={{ color: "#003366", marginBottom: "10px" }}>
                  {course.courseName && course.courseName.length < 8
                    ? `${course.courseName} Tutorial`
                    : course.course_name
                  }
                </h3>
                <p className="course-description" style={{color:"#666", marginBottom: "5px"}}>Price: Rs.{course.price}</p>
                <p className="course-description" style={{color:"#333"}}>Tutorial by {course.instructor}</p>
              </div>
              <div style={{ padding: '20px', paddingTop: 0, marginTop: 'auto' }}>
                {enrolled.includes(course.course_id) ? (
                  <button className="enroll-button" style={{
                    color:'#F4D03F',
                    backgroundColor:'#003366',
                    fontWeight:'bold',
                    padding: "10px 15px",
                    width: "100%",
                    border: "none",
                    cursor: "pointer"
                  }} onClick={(e) => {e.stopPropagation(); navigate(`/course/${course.course_id}`);}}>
                    Continue Learning
                  </button> 
                ) : (
                  <button className="enroll-button" style={{
                    backgroundColor:'#003366',
                    color: "white",
                    fontWeight:'bold',
                    padding: "10px 15px",
                    width: "100%",
                    border: "none",
                    cursor: "pointer"
                  }} onClick={(e) => enrollCourse(course.course_id, e)}>
                    Enroll
                  </button> 
                )}
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', width: '100%', padding: '50px' }}>
            <h3>No courses available at the moment.</h3>
            <p>Please check back later for updates to our course catalog.</p>
          </div>
        )}
      </div>
    </div>
    <Footer />
  </div>
);
}

export default Courses;
