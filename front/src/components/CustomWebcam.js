import Webcam from "react-webcam";
import { useRef, useState, useCallback } from "react";
const CustomWebcam = ({onFoto}) => {
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);
    
    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
        onFoto(imageSrc,true);
      }, [webcamRef,onFoto]);
      const borrar = (() => {
        setImgSrc(null);
        onFoto(null,false);
      });
    return (
        <div className="container">
        {imgSrc ? (
          <img src={imgSrc} alt="webcam" />
        ) : (
          <Webcam height={600} width={600} ref={webcamRef} />
        )}
        <div className="btn-container">
          <button onClick={capture}>Capturar foto</button>
          <button onClick={borrar}>Borrar foto</button>
        </div>
      </div>
    );
  };

export default CustomWebcam;