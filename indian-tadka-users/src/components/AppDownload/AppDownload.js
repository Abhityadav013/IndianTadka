import React from 'react';
import './AppDownload.css';

const AppDownload = () => {
  return (
    <div className='app-download' id='app-download'>
      <p>For Better Experience Download<br/> Indian Tadka</p>
      <div className='app-download-platforms'>
        <img src ='https://testing.indiantadka.eu/assets/play_store.png' alt="Play Store" />
        <img src='https://testing.indiantadka.eu/assets/app_store.png' alt="App Store" />
      </div>
    </div>
  );
};

export default AppDownload;
