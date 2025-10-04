import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Confetti from "react-dom-confetti";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import img from './images/b1.jpg';
import seal from './images/seal.png'

const Certificate = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const authToken = localStorage.getItem("token");
  const id = localStorage.getItem("id");
  const [error, setError] = useState(false);
  const courseId = window.location.pathname.split("/")[2];
  const [course, setCourse] = useState({
    course_name: "",
    instructor: "",
    price: null,
    description: "",
    y_link: "",
    p_link: "",
  });

  useEffect(() => {
    if (!authToken) {
      navigate("/login");
    }

    async function fetchUserDetails() {
      try {
        const response = await fetch(`http://localhost:8080/api/users/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user details.");
        }
        const data = await response.json();
        setUserDetails(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError(true);
      }
    }

    async function fetchCourse() {
      try {
        const response = await fetch(
          `http://localhost:8080/api/courses/${courseId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch course data.");
        }

        const fetchedCourse = await response.json();
        setCourse(fetchedCourse);
      } catch (err) {
        console.error("Error fetching course data:", err);
        setError(true);
      }
    }

    fetchCourse();
    fetchUserDetails();
  }, [authToken, navigate, id, courseId]);

  const generateCertificateNumber = () => {
    return Math.floor(Math.random() * 1000000);
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const currentDate = formatDate(new Date());
  const certificateNumber = generateCertificateNumber();

  const leftConfig = {
    angle: 90,
    spread: 360,
    startVelocity: 80,
    elementCount: 270,
    dragFriction: 0.1,
    duration: 4000,
    stagger: 3,
    width: "10px",
    height: "10px",
    colors: ["#3498db", "#e74c3c", "#27ae60"],
  };

  const rightConfig = {
    angle: 90,
    spread: 180,
    startVelocity: 40,
    elementCount: 70,
    dragFriction: 0.1,
    duration: 3000,
    stagger: 3,
    width: "10px",
    height: "10px",
    colors: ["#3498db", "#e74c3c", "#27ae60"],
  };

  const [pdfDownloading, setPdfDownloading] = useState(false);

  const handleDownloadPDF = () => {
    setPdfDownloading(true);
  
    const certificateElement = document.getElementById("certificate");
  
    if (certificateElement) {
      html2canvas(certificateElement).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
  
        const pdf = new jsPDF("p", "mm", "a4");
        const width = pdf.internal.pageSize.getWidth();
        const height = (canvas.height * width) / canvas.width;
  
        pdf.addImage(imgData, "PNG", 0, 0, width, height);
        pdf.save("certificate.pdf");
  
        setPdfDownloading(false);
      });
    } else {
      console.error("Certificate element not found.");
    }
  };
  

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        margin: 0,
        padding: "20px",
      }}
    >
      <Confetti active={!loading} config={leftConfig} />
      <Confetti active={!loading} config={leftConfig} />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div
        id="certificate"
          style={{
            maxWidth: "600px",
            margin: "50px auto",
            textAlign: "center",
            border: "2px solid #003366",
            padding: "30px",
            borderRadius: "15px",
            background: "linear-gradient(to bottom, #f5f5f5, #e8f4fc)",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"
          }}
        >
          <img
            src={img}
            alt="HackLab Cybersecurity Logo"
            style={{
              width: "120px",
              height: "80px",
              marginBottom: "15px",
              border: "2px solid #003366",
              borderRadius: "10px",
              padding: "5px",
              objectFit: "cover"
            }}
          />
          <h1
            style={{ color: "#003366", marginBottom: "12px", fontSize: "30px" }}
          >
            Cybersecurity Certificate
          </h1>
          <p style={{ color: "#555", margin: "8px 0", fontSize: "18px" }}>
            This is to certify that{" "}
            <span
              id="userName"
              style={{ fontWeight: "bold", color: "#e74c3c", fontSize: "26px" }}
            >
              {userDetails.username}
            </span>
          </p>
          <p style={{ color: "#555", margin: "8px 0", fontSize: "18px" }}>
            has successfully completed the cybersecurity course{" "}
            <span
              id="courseName"
              style={{ color: "#27ae60", fontSize: "25px", fontWeight: "bold" }}
            >
              {course.course_name.length < 10
                ? course.course_name + " Tutorial"
                : course.course_name}
            </span>
          </p>
          <p style={{ color: "#555", margin: "14px 0", fontSize: "16px" }}>
            and has demonstrated proficiency in security concepts and best practices
          </p>
          <p style={{ color: "#6c757d", fontSize: "16px" }}>
            Issued on {currentDate}
          </p>
          <p style={{ color: "#6c757d", fontSize: "16px" }}>
            Certificate ID: {certificateNumber}
          </p>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            marginTop: "30px",
            alignItems: "flex-end"
          }}>
            <div style={{ textAlign: "center", flex: 1 }}>
              <img
                src={seal}
                alt="Signature"
                style={{
                  width: "80px",
                  height: "auto",
                  marginTop: "10px",
                }}
              />
              <p style={{ 
                borderTop: "2px solid #003366", 
                paddingTop: "5px", 
                marginTop: "5px",
                width: "150px",
                margin: "5px auto"
              }}>Official Seal</p>
            </div>
          </div>
          <Confetti active={!loading} config={rightConfig} />
        </div>
      )}
      <button
        onClick={handleDownloadPDF}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "18px",
          backgroundColor: "#003366",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          display: "block",
          margin: "20px auto"
        }}
      >
        {pdfDownloading ? "Downloading..." : "Download Certificate as PDF"}
      </button>
    </div>
  );
};

export default Certificate;
