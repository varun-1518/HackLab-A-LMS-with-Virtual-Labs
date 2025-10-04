import React from "react";

const ImgUpload = ({ onChange, src }) => (
  <label htmlFor="photo-upload" className="custom-file-upload fas">
    <div className="img-wrap img-upload" style={{ 
      borderRadius: '50%', 
      overflow: 'hidden', 
      width: '120px',  
      height: '120px',
      margin: '0 auto'
    }}>
      {src ? (
        <img htmlFor="photo-upload" src={src} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
      ) : (
        <div style={{ marginTop: "32px", fontSize: '14px' }}>Upload your Image Here✌</div>
      )}
    </div>  
    <input id="photo-upload" type="file" onChange={onChange} />
  </label>
);

export default ImgUpload;
