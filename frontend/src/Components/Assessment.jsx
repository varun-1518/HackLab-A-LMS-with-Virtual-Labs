import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { faBackward } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal, Button, Card, Progress, Typography, Space, Radio } from 'antd';
import axios from 'axios';
import './css/style.css';

const { Title, Text } = Typography;

function Assessment() {
  const location = useLocation();
  const navigate = useNavigate();
  const courseId = location.pathname.split("/")[2];
  const [test, setTest] = useState([]);
  const [userId, setUserId] = useState(localStorage.getItem("id"));
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [correctCount, setCorrectCount] = useState(0); 
  const [openModal, setOpenModal] = useState(false);
  const [totalQsns, setTotalQsns] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:8080/api/questions/${courseId}`)
      .then(res => res.json())
      .then(res => {
        setTest(res);
        setTotalQsns(res.length);
        setSelectedAnswers(new Array(res.length).fill(null));
      })
      .catch(error => console.error("Error fetching data:", error));
  }, [courseId]);

  const handleRadioChange = (questionIndex, selectedOption) => {
    const updatedSelectedAnswers = [...selectedAnswers];
    const qsn = test[questionIndex];
    
    if (updatedSelectedAnswers[questionIndex] === selectedOption) {
      // If clicking the same option again, deselect it
      updatedSelectedAnswers[questionIndex] = null;
      if (qsn.answer === selectedOption) {
        setCorrectCount(correctCount - 1);
      }
    } else {
      // If there was a previous selection, update the count
      if (updatedSelectedAnswers[questionIndex] === qsn.answer) {
        setCorrectCount(correctCount - 1);
      }
      // Set the new selection
      updatedSelectedAnswers[questionIndex] = selectedOption;
      if (qsn.answer === selectedOption) {
        setCorrectCount(correctCount + 1);
      }
    }
    
    setSelectedAnswers(updatedSelectedAnswers);
  };

  const handleMarks = () => {
    const data = {
      courseId: courseId, 
      userId: localStorage.getItem("id"),  
      marks: (correctCount/totalQsns)*100 
    };
    axios.post(`http://localhost:8080/api/assessments/add/${userId}/${courseId}`, data)
      .then(response => {
        console.log('Request successful:', response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const showModal = () => {
    setOpenModal(true);
  };

  const handleOk = () => {
    setOpenModal(false);
    navigate(`/course/${courseId}`);
  };

  const handleCancel = () => {
    setOpenModal(false);
  };

  const getMessage = () => {
    if (correctCount === totalQsns) {
      return 'Excellent! 🎉';
    } else if (correctCount >= totalQsns * 0.7) {
      return 'Good Job! 😊';
    } else if (correctCount >= totalQsns * 0.5) {
      return 'Keep Practicing! 💪';
    } else {
      return 'You Can Do Better! 📚';
    }
  };

  const progress = ((currentQuestion + 1) / totalQsns) * 100;

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '20px'
    }}>
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        background: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '30px',
          padding: '0 10px',
          position: 'relative'
        }}>
          <Button 
            type="primary" 
            icon={<FontAwesomeIcon icon={faBackward} />}
            onClick={() => navigate(`/course/${courseId}`)}
            style={{ 
              background: '#1890ff', 
              borderColor: '#1890ff',
              color: '#ffffff',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '0 15px',
              height: '40px',
              position: 'absolute',
              left: '0'
            }}
          >
            <span>Back to Course</span>
          </Button>
          <Title level={2} style={{ 
            margin: 0, 
            color: '#1a365d',
            textAlign: 'center',
            width: '100%'
          }}>
            Assessment
          </Title>
        </div>

        <Progress 
          percent={Math.round((currentQuestion / totalQsns) * 100)} 
          status="active" 
          style={{ 
            marginBottom: '30px',
            padding: '0 10px'
          }}
        />

        <div className="assessment-form">
          {test.map((question, index) => (
            <Card 
              key={question.no} 
              style={{ 
                marginBottom: '20px',
                borderRadius: '8px',
                display: index === currentQuestion ? 'block' : 'none',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
              }}
            >
              <Title level={4} style={{ 
                marginBottom: '20px', 
                color: '#2d3748',
                textAlign: 'center',
                fontWeight: '600'
              }}>
                Question {index + 1} of {totalQsns}
              </Title>
              <Text style={{ 
                fontSize: '16px', 
                display: 'block', 
                marginBottom: '20px',
                color: '#4a5568',
                lineHeight: '1.6',
                padding: '0 10px'
              }}>
                {question.question}
              </Text>
              
              <Space direction="vertical" style={{ width: '100%', padding: '0 10px' }}>
                {[question.option1, question.option2, question.option3, question.option4].map((option, i) => (
                  <Radio 
                    key={i}
                    checked={selectedAnswers[index] === option}
                    onChange={() => handleRadioChange(index, option)}
                    style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      minHeight: '40px',
                      fontSize: '16px',
                      color: '#2d3748',
                      padding: '8px 15px',
                      borderRadius: '4px',
                      backgroundColor: selectedAnswers[index] === option ? '#ebf8ff' : 'transparent',
                      transition: 'background-color 0.3s ease',
                      marginBottom: '8px',
                      width: '100%',
                      whiteSpace: 'normal',
                      wordBreak: 'break-word'
                    }}
                  >
                    <span style={{ 
                      display: 'inline-block',
                      maxWidth: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {option}
                    </span>
                  </Radio>
                ))}
              </Space>
            </Card>
          ))}
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginTop: '30px',
          padding: '20px 10px',
          borderTop: '1px solid #e2e8f0'
        }}>
          <Button 
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            style={{
              minWidth: '120px',
              height: '40px',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            Previous
          </Button>
          {currentQuestion < totalQsns - 1 ? (
            <Button 
              type="primary"
              onClick={() => setCurrentQuestion(prev => Math.min(totalQsns - 1, prev + 1))}
              disabled={selectedAnswers[currentQuestion] === null}
              style={{
                minWidth: '120px',
                height: '40px',
                fontSize: '16px',
                fontWeight: '500',
                background: '#1890ff',
                borderColor: '#1890ff'
              }}
            >
              Next
            </Button>
          ) : (
            <Button 
              type="primary"
              onClick={() => { handleMarks(); showModal(); }}
              disabled={selectedAnswers[currentQuestion] === null}
              style={{ 
                minWidth: '120px',
                height: '40px',
                fontSize: '16px',
                fontWeight: '500',
                background: '#52c41a', 
                borderColor: '#52c41a',
                color: '#ffffff'
              }}
            >
              Submit Assessment
            </Button>
          )}
        </div>
      </div>

      <Modal
        title="Assessment Results"
        open={openModal}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button 
            key="back" 
            onClick={handleCancel}
            style={{
              minWidth: '120px',
              height: '40px',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            Review Answers
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            onClick={handleOk}
            style={{
              minWidth: '120px',
              height: '40px',
              fontSize: '16px',
              fontWeight: '500',
              background: '#1890ff',
              borderColor: '#1890ff'
            }}
          >
            Return to Course
          </Button>
        ]}
      >
        <div style={{ 
          textAlign: 'center', 
          padding: '20px',
          background: '#f8fafc',
          borderRadius: '8px'
        }}>
          <Title level={2} style={{ 
            color: '#1a365d',
            marginBottom: '20px'
          }}>
            {getMessage()}
          </Title>
          <Progress 
            type="circle" 
            percent={Math.round((correctCount/totalQsns)*100)} 
            style={{ 
              margin: '20px 0',
              color: '#1a365d'
            }}
          />
          <Text style={{ 
            fontSize: '16px', 
            display: 'block',
            color: '#2d3748',
            marginBottom: '10px'
          }}>
            You answered {correctCount} out of {totalQsns} questions correctly.
          </Text>
          <Text style={{ 
            fontSize: '16px', 
            display: 'block',
            color: '#2d3748',
            fontWeight: '500'
          }}>
            Score: {Math.round((correctCount/totalQsns)*100)}%
          </Text>
        </div>
      </Modal>
    </div>
  );
}

export default Assessment;
