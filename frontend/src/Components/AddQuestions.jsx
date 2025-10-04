import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';
import { Button, Input } from 'antd';
import './css/style.css';

function AddQuestion() {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const courseId = location.pathname.split("/")[2];
  
  // Initialize with one empty question
  const [questions, setQuestions] = useState([{
    question: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    answer: '',
    courseId: courseId,
  }]);

  const [formErrors, setFormErrors] = useState([{
    question: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    answer: '',
  }]);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedQuestions = [...questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [name]: value
    };
    setQuestions(updatedQuestions);

    // Update errors
    const updatedErrors = [...formErrors];
    let error = '';
    if (name === 'question' && value === '') {
      error = 'Question is required';
    } else if (name === 'option1' && value === '') {
      error = 'Option 1 is required';
    } else if (name === 'option2' && value === '') {
      error = 'Option 2 is required';
    } else if (name === 'option3' && value === '') {
      error = 'Option 3 is required';
    } else if (name === 'option4' && value === '') {
      error = 'Option 4 is required';
    } else if (name === 'answer' && value === '') {
      error = 'Correct answer is required';
    }
    updatedErrors[index] = {
      ...updatedErrors[index],
      [name]: error
    };
    setFormErrors(updatedErrors);
  };

  const addQuestion = () => {
    setQuestions([...questions, {
      question: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      answer: '',
      courseId: courseId,
    }]);
    setFormErrors([...formErrors, {
      question: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      answer: '',
    }]);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      const updatedQuestions = questions.filter((_, i) => i !== index);
      const updatedErrors = formErrors.filter((_, i) => i !== index);
      setQuestions(updatedQuestions);
      setFormErrors(updatedErrors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isFormValid = true;
    const newFieldErrors = [...formErrors];

    questions.forEach((question, index) => {
      const formKeys = Object.keys(question);
      formKeys.forEach(key => {
        if (!question[key]) {
          newFieldErrors[index] = {
            ...newFieldErrors[index],
            [key]: 'This field is required'
          };
          isFormValid = false;
        }
      });
    });
    
    if (!isFormValid) {
      setFormErrors(newFieldErrors);
      return;
    }

    try {
      // Submit each question individually
      for (const question of questions) {
        const response = await fetch('http://localhost:8080/api/questions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(question),
        });
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to add question');
        }
      }

      toast.success('Questions Added Successfully', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Reset form
      setQuestions([{
        question: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        answer: '',
        courseId: courseId,
      }]);
      setFormErrors([{
        question: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        answer: '',
      }]);
      
    } catch (error) {
      setError(error.message);
      toast.error('Error adding questions: ' + error.message, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="add" style={{ 
      padding: '20px', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div className="container1" style={{ 
        background: 'white', 
        padding: '30px', 
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '90%',
        maxWidth: '800px'
      }}>
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '30px', 
          color: '#2c3e50',
          fontSize: '28px',
          fontWeight: '600'
        }}>Add Questions</h2>
        
        <form onSubmit={handleSubmit} className="addQuestion-form" noValidate>
          {questions.map((question, index) => (
            <div 
              key={index} 
              className="question-container" 
              style={{ 
                marginBottom: '30px',
                padding: '25px',
                border: '1px solid #e8e8e8',
                borderRadius: '8px',
                background: '#ffffff'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, color: '#2c3e50', fontSize: '20px' }}>Question {index + 1}</h3>
                {questions.length > 1 && (
                  <Button 
                    type="primary" 
                    danger 
                    onClick={() => removeQuestion(index)}
                    style={{ 
                      padding: '0 20px',
                      height: '36px',
                      background: '#ff4d4f',
                      borderColor: '#ff4d4f',
                      color: 'white'
                    }}
                  >
                    Remove
                  </Button>
                )}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#2c3e50' }}>Question Text</label>
                <Input.TextArea
                  name="question"
                  value={question.question}
                  onChange={(e) => handleChange(e, index)}
                  placeholder="Enter your question here..."
                  autoSize={{ minRows: 2, maxRows: 4 }}
                  style={{ width: '100%' }}
                />
                {formErrors[index]?.question && (
                  <span style={{ color: 'red', fontSize: '12px', display: 'block', marginTop: '5px' }}>
                    {formErrors[index].question}
                  </span>
                )}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#2c3e50' }}>Options</label>
                {['option1', 'option2', 'option3', 'option4'].map((option, i) => (
                  <div key={option} style={{ marginBottom: '12px' }}>
                    <Input
                      name={option}
                      value={question[option]}
                      onChange={(e) => handleChange(e, index)}
                      placeholder={`Option ${i + 1}`}
                      style={{ width: '100%' }}
                    />
                    {formErrors[index]?.[option] && (
                      <span style={{ color: 'red', fontSize: '12px', display: 'block', marginTop: '5px' }}>
                        {formErrors[index][option]}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#2c3e50' }}>Correct Answer</label>
                <Input
                  name="answer"
                  value={question.answer}
                  onChange={(e) => handleChange(e, index)}
                  placeholder="Enter the correct answer"
                  style={{ width: '100%' }}
                />
                {formErrors[index]?.answer && (
                  <span style={{ color: 'red', fontSize: '12px', display: 'block', marginTop: '5px' }}>
                    {formErrors[index].answer}
                  </span>
                )}
              </div>
            </div>
          ))}

          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <Button 
              type="primary" 
              onClick={addQuestion}
              style={{ 
                marginRight: '15px', 
                padding: '0 25px',
                height: '40px',
                background: '#1890ff',
                borderColor: '#1890ff',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              Add Another Question
            </Button>
            <Button 
              type="primary" 
              htmlType="submit"
              style={{ 
                padding: '0 25px',
                height: '40px',
                background: '#52c41a',
                borderColor: '#52c41a',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              Save Questions
            </Button>
          </div>

          {error && (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <span style={{ color: 'red', fontSize: '14px' }}>{error}</span>
            </div>
          )}
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default AddQuestion;