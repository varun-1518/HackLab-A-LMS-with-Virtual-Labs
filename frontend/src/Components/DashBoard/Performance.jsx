import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './dstyle.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faChartLine, faDownload, faSpinner, faCheckCircle, faClock } from '@fortawesome/free-solid-svg-icons';

const Performance = () => {
  const [performanceData, setPerfomanceData] = useState([]);
  const [enrolledcourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    async function fetchCourse() {
      try {
        const userId = localStorage.getItem("id");
        const response = await axios.get(`http://localhost:8080/api/learning/${userId}`);
        const fetchedCourse = response.data || [];
        setEnrolledCourses(Array.isArray(fetchedCourse) ? fetchedCourse : []);
      } catch (err) {
        console.log(err); 
        setEnrolledCourses([]);
      }
    }
    fetchCourse();
  }, []);

  useEffect(() => {
    async function fetchPerformanceData() {
      try {
        setLoading(true);
        const userId = localStorage.getItem("id");
        const response = await fetch(`http://localhost:8080/api/assessments/perfomance/${userId}`);
        const data = await response.json();
        
        // Ensure data is an array
        if (Array.isArray(data)) {
          setPerfomanceData(data);
        } else {
          console.error("Performance data is not an array:", data);
          setPerfomanceData([]);
        }
      } catch (err) {
        console.error("Error fetching performance data:", err);
        setPerfomanceData([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchPerformanceData();
  }, []);

  function certifiedUser(id) {
    navigate(`/certificate/${id}`);
  }

  return (
    <div className="performance-dashboard">
      {/* Enrolled Courses Section */}
      <div className="dashboard-section">
        <div className="section-header">
          <FontAwesomeIcon icon={faGraduationCap} />
          <h2>My Enrolled Courses</h2>
        </div>
        
        <div className="courses-grid">
          {enrolledcourses.length > 0 ? (
            enrolledcourses.map((course, index) => (
              <div 
                key={index} 
                className="course-card"
                onClick={() => navigate(`/course/${course.id}`)}
              >
                <div className="course-name">{course.course_name}</div>
                <div className="course-instructor">by {course.instructor}</div>
                <div className="course-action">Click to continue learning</div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>You haven't enrolled in any courses yet</p>
              <button onClick={() => navigate('/courses')}>
                Browse Courses
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Performance Section */}
      <div className="dashboard-section">
        <div className="section-header">
          <FontAwesomeIcon icon={faChartLine} />
          <h2>My Performance</h2>
        </div>
        
        {loading ? (
          <div className="loading-state">
            <FontAwesomeIcon icon={faSpinner} spin />
            <p>Loading performance data...</p>
          </div>
        ) : (
          <div className="performance-grid">
            {performanceData.length > 0 ? (
              performanceData.map((data, index) => (
                <div key={index} className="performance-card">
                  <div className="performance-title">{data.course?.course_name || 'Unknown Course'}</div>
                  
                  <div className="performance-stat">
                    <div className="stat-label">Status:</div>
                    <div className={data.marks !== 0 ? 'stat-value completed' : 'stat-value pending'}>
                      <FontAwesomeIcon icon={data.marks !== 0 ? faCheckCircle : faClock} />
                      {data.marks !== 0 ? 'Completed' : 'Pending'}
                    </div>
                  </div>
                  
                  <div className="performance-stat">
                    <div className="stat-label">Marks:</div>
                    <div className="stat-value">{data.marks}</div>
                  </div>
                  
                  {data.marks !== 0 && data.course?.id && (
                    <button 
                      className="certificate-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        certifiedUser(data.course.id);
                      }}
                    >
                      <FontAwesomeIcon icon={faDownload} />
                      Download Certificate
                    </button>
                  )}
                  
                  {data.marks === 0 && (
                    <div className="not-available">Certificate not available yet</div>
                  )}
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No performance data available</p>
                <p>Complete courses and assessments to see your performance</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Performance;
