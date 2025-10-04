import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faExternalLinkAlt, faTimes, faCode, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

function LabAccess() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleGoToLab = () => {
    window.open('https://35.207.213.179/#/staticlogin', '_blank', 'noopener,noreferrer');
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsModalVisible(true)}
        className="nav-button"
        style={{ 
          backgroundColor: 'transparent',
          border: 'none',
          padding: '8px 12px',
          cursor: 'pointer',
          color: '#0055a4',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}
      >
        Lab Access <FontAwesomeIcon icon={faCode} style={{ marginLeft: '5px' }} />
      </button>

      <Modal
        title="Lab Access Credentials"
        open={isModalVisible}
        onCancel={handleCancel}
        closeIcon={<FontAwesomeIcon icon={faTimes} style={{ fontSize: '16px' }} />}
        footer={[
          <button 
            key="back" 
            onClick={handleCancel}
            className="cancel-button"
            style={{
              padding: '8px 16px',
              border: '1px solid #0055a4',
              borderRadius: '4px',
              backgroundColor: 'transparent',
              color: '#0055a4',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Cancel
          </button>,
          <button 
            key="submit" 
            onClick={handleGoToLab}
            className="primary-button"
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: '#0055a4',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Go to Lab <FontAwesomeIcon icon={faExternalLinkAlt} style={{ marginLeft: '8px' }} />
          </button>
        ]}
        width={500}
        bodyStyle={{ padding: '24px' }}
      >
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{ 
            backgroundColor: '#f0f2f5', 
            padding: '20px', 
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ 
              color: '#0055a4', 
              marginBottom: '20px',
              fontSize: '18px',
              fontWeight: '600'
            }}>
              Please use these credentials to access the lab:
            </h3>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: '15px'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: '10px'
              }}>
                <FontAwesomeIcon icon={faUser} style={{ 
                  color: '#0055a4',
                  fontSize: '16px',
                  width: '20px'
                }} />
                <span style={{ 
                  fontWeight: '600',
                  minWidth: '80px'
                }}>Username:</span>
                <span style={{ 
                  fontFamily: 'monospace',
                  backgroundColor: '#e9ecef',
                  padding: '4px 8px',
                  borderRadius: '4px'
                }}>root</span>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: '10px'
              }}>
                <FontAwesomeIcon icon={faLock} style={{ 
                  color: '#0055a4',
                  fontSize: '16px',
                  width: '20px'
                }} />
                <span style={{ 
                  fontWeight: '600',
                  minWidth: '80px'
                }}>Password:</span>
                <span style={{ 
                  fontFamily: 'monospace',
                  backgroundColor: '#e9ecef',
                  padding: '4px 8px',
                  borderRadius: '4px'
                }}>Abcd@1234</span>
              </div>
            </div>
          </div>

          <div style={{ 
            backgroundColor: '#fff3cd', 
            padding: '20px', 
            borderRadius: '8px',
            border: '1px solid #ffeeba'
          }}>
            <h4 style={{ 
              color: '#856404', 
              marginBottom: '15px',
              fontSize: '16px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <FontAwesomeIcon icon={faInfoCircle} />
              Important Instructions
            </h4>
            <ol style={{ 
              color: '#856404', 
              paddingLeft: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <li>After logging in, wait for the Kasm workspace to load completely</li>
              <li>Click on the "Applications" menu in the top-left corner</li>
              <li>Select "Kali Linux" from the applications list</li>
              <li>Wait for Kali Linux to initialize (this may take a few moments)</li>
              <li>Once loaded, you'll have access to all Kali Linux tools and features</li>
            </ol>
          </div>

          <p style={{ 
            color: '#666', 
            fontSize: '14px',
            lineHeight: '1.5',
            textAlign: 'center',
            padding: '10px',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px'
          }}>
            Note: These credentials are required to access the lab environment. Please keep them secure.
          </p>
        </div>
      </Modal>
    </>
  );
}

export default LabAccess; 