import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";

function ImageDebug() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all courses to check their image URLs
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/courses");
        setCourses(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch courses: " + err.message);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h1>Course Image Debug</h1>
        <p>This page helps diagnose issues with course images</p>

        <div style={{ marginTop: "30px" }}>
          <h2>Course Image URLs</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Course ID</th>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Course Name</th>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Image URL (p_link)</th>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Test Image</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.course_id}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{course.course_id}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{course.course_name}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px", wordBreak: "break-all" }}>
                    {course.p_link || "N/A"}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {course.p_link ? (
                      <div>
                        <img 
                          src={course.p_link} 
                          alt={`Test for ${course.course_name}`} 
                          style={{ maxWidth: "100px", maxHeight: "60px" }} 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/100x60?text=Error";
                          }}
                        />
                        <div style={{ marginTop: "5px" }}>
                          <a href={course.p_link} target="_blank" rel="noopener noreferrer">Open URL</a>
                        </div>
                      </div>
                    ) : (
                      "No image URL"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: "50px" }}>
          <h2>Recommendation</h2>
          <p>If images are not loading:</p>
          <ol>
            <li>Check if URLs are valid and accessible</li>
            <li>Ensure URLs use HTTPS for secure sites</li>
            <li>Verify image servers allow cross-origin requests</li>
            <li>For local development, try using public image hosting services (e.g., Imgur, Cloudinary)</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default ImageDebug; 