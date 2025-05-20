import { useState, useEffect, useCallback, useRef } from "react";
import { BsFillMicFill, BsFillMicMuteFill } from "react-icons/bs";

const VoiceInput = ({ onResult }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [recognition, setRecognition] = useState(null);

  const isListeningRef = useRef(isListening);
  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening, recognition]);

  const handleResult = useCallback(
    (transcript) => {
      onResult(transcript);
    },
    [onResult]
  );

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition]);

  const startListening = useCallback(() => {
    if (recognition && !isListeningRef.current) {
      try {
        recognition.start();
        setIsListening(true);
      } catch (err) {
        console.error("Error starting recognition:", err);
      }
    }
  }, [recognition]);

  // const handleResult = useCallback(
  //   (transcript) => {
  //     onResult(transcript);
  //   },
  //   [onResult]
  // );

  // const stopListening = useCallback(() => {
  //   if (recognition) {
  //     recognition.stop();
  //     setIsListening(false);
  //   }
  // }, [recognition]);

  // const startListening = useCallback(() => {
  //   if (recognition && !isListening) {
  //     try {
  //       recognition.start();
  //       setIsListening(true);
  //     } catch (err) {
  //       console.error("Error starting recognition:", err);
  //     }
  //   }
  // }, [recognition, isListening]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = "en-US";

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleResult(transcript);
      };

      recognitionInstance.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        if (isListeningRef.current) {
          recognitionInstance.start();
        }
      };

      setRecognition(recognitionInstance);
    }

    return () => {
      if (recognition) recognition.stop();
    };
  }, [handleResult]);

  const toggleListening = () => {
    if (!isSupported) return;

    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isSupported) {
    return (
      <button
        disabled
        className="p-2 text-gray-400 cursor-not-allowed"
        title="Voice input not supported in your browser"
      >
        <BsFillMicMuteFill size={20} />
      </button>
    );
  }

  return (
    <button
      onClick={toggleListening}
      className={`p-2 rounded-full transition-colors ${
        isListening
          ? "text-red-500 animate-pulse"
          : "text-blue-600 hover:text-blue-700"
      }`}
      title={isListening ? "Stop listening" : "Start voice input"}
      aria-label={isListening ? "Stop listening" : "Start voice input"}
    >
      {isListening ? (
        <BsFillMicFill size={24} className="animate-pulse" />
      ) : (
        <BsFillMicFill size={24} />
      )}
    </button>
  );
};

export default VoiceInput;
