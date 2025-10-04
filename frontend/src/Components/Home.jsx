import React, { useState, useEffect } from "react";
import { useUserContext } from "./UserContext";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import c1 from "./images/b1.jpg";
import c2 from "./images/b2.jpg";
import c3 from "./images/b3.jpg";
import c4 from "./images/b4.png";
import "./css/style.css";
import {
  faGraduationCap,
  faAward,
  faStar,
  faShield,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from "react-router-dom";
import Footer from "./header and footer/Footer";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Button } from "antd";

function Home() {
  const navigate = useNavigate();
  const authToken = localStorage.getItem("token");
  const userId = localStorage.getItem("id");
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  // Define closeModal before it's used in the useEffect
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };
  
  // Function to select an appropriate image based on course name
  const getImageForCourse = (courseName, courseDesc) => {
    const name = (courseName + " " + (courseDesc || "")).toLowerCase();
    
    if (name.includes("network") || name.includes("infrastructure")) 
      return c1;
    else if (name.includes("hack") || name.includes("penetration") || name.includes("ethical"))
      return c2;
    else if (name.includes("web") || name.includes("application"))
      return c3;
    else if (name.includes("malware") || name.includes("forensic") || name.includes("analysis"))
      return c4;
    else
      return c1; // default
  };
  
  useEffect(() => {
    // Fetch courses
    fetch("http://localhost:8080/api/courses")
      .then((response) => response.json())
      .then((data) => {
        // Get only the first 3 courses for homepage display
        const availableCourses = data.slice(0, 3);
        setCourses(availableCourses);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
        setLoading(false);
      });
    
    // Fetch enrolled courses if user is logged in
    if (userId && authToken) {
      fetch(`http://localhost:8080/api/learning/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          let enrolledIds = [];
          if (Array.isArray(data)) {
            enrolledIds = data.map(course => course.id || course.course_id);
          }
          setEnrolledCourses(enrolledIds);
        })
        .catch((error) => {
          console.error("Error fetching enrolled courses:", error);
        });
    }

    // Add event listener to log modal visibility changes for debugging
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        console.log('Escape key pressed while modal is open');
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [userId, authToken, isModalOpen]);

  const handleCourseClick = (course) => {
    // Check if user is enrolled in this course
    console.log('Course clicked:', course);
    
    // First set the selected course
    setSelectedCourse(course);
    
    // Small delay to ensure state is updated before showing modal
    setTimeout(() => {
      if (enrolledCourses.includes(course.id) || enrolledCourses.includes(course.course_id)) {
        // If enrolled, ask user if they want to continue learning
        setIsModalOpen(true);
        console.log('User is enrolled, showing continue learning modal');
      } else {
        // If not enrolled, show enrollment modal
        setIsModalOpen(true);
        console.log('User is not enrolled, showing enrollment modal');
      }
    }, 50);
  };

  const enrollCourse = (courseId) => {
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
            setEnrolledCourses([...enrolledCourses, courseId]);
            closeModal();
            
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
            closeModal();
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
      closeModal();
      setTimeout(()=>{
        navigate('/login');
      },2000);
    }
  };
  
  return (
    <div>
      <Navbar page={"home"} />
      <div>
        <section id="home">
          <h2>Enhance your future with HackLab</h2>
          <p>
            {" "}
            HackLab is a specialized cybersecurity course provider, offering comprehensive
            learning experiences in network security, ethical hacking, penetration testing, and more.
            Our coursework includes videos, labs, assessments, and hands-on practice with real-world scenarios.
          </p>
          <div className="btn">
            
            <Link to="/courses" className="yellow">
              Visit Courses
            </Link>
          </div>
        </section>
        <section id="features">
          <h1>Cybersecurity Training Features</h1>
          <p>Build your defensive and offensive security skills</p>
          <div className="fea-base">
            <div className="fea-box">
              <FontAwesomeIcon icon={faShield} className="i" />
              <h3>Hands-on Labs</h3>
              <p>Practice in secure sandbox environments with real-world scenarios</p>
            </div>
            <div className="fea-box">
              <FontAwesomeIcon icon={faLock} className="i" />
              <h3>Industry Certifications</h3>
              <p>
                Prepare for recognized security certifications like CompTIA, CEH, and CISSP
              </p>
            </div>
            <div className="fea-box">
              <FontAwesomeIcon icon={faAward} className="i" />
              <h3>Expert Instruction</h3>
              <p>
                Learn from seasoned cybersecurity professionals with years of field experience
              </p>
            </div>
          </div>
        </section>
        <section id="course">
          <h1>Our Cybersecurity Courses</h1>
          <p>10,000+ security professionals trained</p>
          <div className="course-box">
            {loading ? (
              <p>Loading courses...</p>
            ) : courses.length > 0 ? (
              courses.map((course) => (
                <div key={course.course_id} className="courses" onClick={() => handleCourseClick(course)}
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
                >
                  <img 
                    src={course.p_link || getImageForCourse(course.course_name, course.description)} 
                    alt={course.course_name} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = getImageForCourse(course.course_name, course.description);
                    }}
                    style={{
                      width: '100%',
                      height: '180px',
                      objectFit: 'cover',
                      borderTopLeftRadius: '12px',
                      borderTopRightRadius: '12px'
                    }}
                  />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', padding: '20px', paddingBottom: 0 }}>
                    <p>Updated {new Date().toLocaleDateString()}</p>
                    <h6 style={{ margin: '10px 0 8px 0', fontWeight: 600 }}>{course.course_name}</h6>
                    <div className="star" style={{ marginBottom: '8px' }}>
                      {[...Array(5)].map((_, index) => (
                        <FontAwesomeIcon key={index} icon={faStar} className="i" />
                      ))}
                      <p style={{ marginLeft: '8px' }}>(239)</p>
                    </div>
                    <div style={{ color: '#888', fontSize: '15px', marginBottom: '8px' }}>Price: Rs.{course.price}</div>
                    {course.tutorial && <div style={{ color: '#888', fontSize: '14px', marginBottom: '8px' }}>Tutorial by {course.tutorial}</div>}
                  </div>
                  <div style={{ padding: '20px', paddingTop: 0, marginTop: 'auto' }}>
                    <button
                      style={{
                        width: '100%',
                        background: '#003366',
                        color: '#fff',
                        fontWeight: 'bold',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '12px 0',
                        fontSize: '16px',
                        cursor: 'pointer',
                        marginTop: 'auto'
                      }}
                    >
                      {enrolledCourses.includes(course.id) || enrolledCourses.includes(course.course_id) ? 'Continue Learning' : 'Enroll'}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', width: '100%', padding: '20px' }}>
                <p>No courses available at the moment. Check back later!</p>
              </div>
            )}
          </div>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link to="/courses" className="yellow">
              View All Courses
            </Link>
          </div>
        </section>
        <section id="registration">
          <div className="reminder">
            <p>Start Your Cybersecurity Career Today</p>
            <h1>Join Our Specialized Training Program</h1>
          </div>
          
        </section>
        <Footer />
      </div>

      {/* Enrollment Modal */}
      <Modal
        title={selectedCourse ? `${selectedCourse.course_name}` : "Course Enrollment"}
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        centered
        destroyOnClose={true}
        maskClosable={true}
        width={600}
        style={{ top: 20 }}
        zIndex={1001}
        className="enrollment-modal"
      >
        {selectedCourse && (
          <div style={{ textAlign: 'center' }}>
            <img 
              src={selectedCourse.p_link || getImageForCourse(selectedCourse.course_name, selectedCourse.description)} 
              alt={selectedCourse.course_name}
              style={{ maxWidth: '100%', height: 'auto', marginBottom: '15px', borderRadius: '8px' }}
            />
            <h3 style={{ fontSize: '24px', color: '#003366', marginBottom: '10px' }}>{selectedCourse.course_name}</h3>
            <p style={{ margin: '10px 0 20px 0', fontSize: '16px', lineHeight: '1.5' }}>
              {selectedCourse.description || "Learn the fundamentals and advanced concepts of cybersecurity."}
            </p>
            
            <div style={{ background: '#f5f8fa', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '5px', color: '#003366' }}>Course Details:</p>
              <p style={{ marginBottom: '5px' }}><strong>Instructor:</strong> {selectedCourse.instructor || "Expert Instructor"}</p>
              <p style={{ fontWeight: 'bold', color: '#e63946' }}>Price: Rs.{selectedCourse.price}</p>
            </div>
            
            {enrolledCourses.includes(selectedCourse.id) || enrolledCourses.includes(selectedCourse.course_id) ? (
              <Button 
                type="primary"
                size="large"
                className="course-enrollment-btn"
                style={{ 
                  backgroundColor: '#003366', 
                  color: '#F4D03F', 
                  fontWeight: 'bold', 
                  width: '100%',
                  height: '50px',
                  fontSize: '16px',
                  border: 'none'
                }}
                onClick={() => navigate(`/course/${selectedCourse.course_id}`)}
              >
                Start Learning Now
              </Button>
            ) : (
              <Button 
                type="primary"
                size="large"
                className="course-enrollment-btn"
                style={{ 
                  backgroundColor: '#003366', 
                  width: '100%',
                  height: '50px',
                  fontSize: '16px',
                  border: 'none'
                }}
                onClick={() => enrollCourse(selectedCourse.course_id)}
              >
                Enroll in This Course
              </Button>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
export default Home;
