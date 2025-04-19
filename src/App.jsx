import 'regenerator-runtime/runtime';
import { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import {
  ChakraProvider,
  Box,
  Stack,
  Input,
  Button,
  Text,
  Heading,
  useToast,
  FormLabel,
} from '@chakra-ui/react';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';

// Initialize Gemini AI with proper configuration
const genAI = new GoogleGenAI({ apiKey: 'AIzaSyC2mhhO-NP_cA67iAKdnYTewZoReSka40E' });

// Initialize speech recognition
const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const speechRecognition = recognition ? new recognition() : null;

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
  const toast = useToast();

  const processWithGemini = useCallback(async (text) => {
    try {
      setLoading(true);

      const prompt = `Extract the following information from this text and return it as a JSON object with these fields: name, email, phone, address. If a field is not found, leave it empty. Here's the text to process: ${text}. Please ensure the response is a valid JSON string.`;

      const response = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt
      });

      let extractedData;
      try {
        const responseText = response.text;
        // Try to extract JSON from the response if it's wrapped in text
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        extractedData = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        throw new Error('Failed to parse the AI response');
      }

      setFormData(prev => ({
        ...prev,
        ...extractedData
      }));

      toast({
        title: "Form Updated",
        description: "The form has been filled with the extracted information.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error processing with Gemini:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to process the voice input. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!speechRecognition) return;

    speechRecognition.continuous = true;
    speechRecognition.interimResults = true;

    speechRecognition.onresult = (event) => {
      const currentTranscript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      setTranscript(currentTranscript);
    };

    speechRecognition.onend = () => {
      if (isListening) {
        speechRecognition.start();
      }
    };

    return () => {
      speechRecognition.stop();
    };
  }, [isListening]);

  const handleStartListening = () => {
    if (!speechRecognition) {
      toast({
        title: "Error",
        description: "Speech recognition is not supported in your browser.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setIsListening(true);
    setTranscript('');
    speechRecognition.start();
  };

  const handleStopListening = () => {
    setIsListening(false);
    speechRecognition.stop();
    if (transcript) {
      processWithGemini(transcript);
    }
  };

  if (!speechRecognition) {
    return (
      <ChakraProvider>
        <Box p={8}>
          <Text>Speech recognition is not supported in your browser.</Text>
        </Box>
      </ChakraProvider>
    );
  }

  return (
    <ChakraProvider>
      <Box maxW="800px" mx="auto" p={8}>
        <Stack spacing={6}>
          <Heading textAlign="center" mb={6}>Voice-Controlled Form</Heading>

          <Box textAlign="center" mb={6}>
            <Button
              leftIcon={isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
              onClick={isListening ? handleStopListening : handleStartListening}
              colorScheme={isListening ? "red" : "green"}
              isLoading={loading}
              size="lg"
              mb={4}
            >
              {isListening ? "Stop Listening" : "Start Listening"}
            </Button>

            {transcript && (
              <Text mt={2} fontSize="sm" color="gray.600">
                Transcript: {transcript}
              </Text>
            )}
          </Box>

          <Stack spacing={4} as="form">
            <Box>
              <FormLabel>Name</FormLabel>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your name"
              />
            </Box>

            <Box>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Your email"
              />
            </Box>

            <Box>
              <FormLabel>Phone</FormLabel>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Your phone number"
              />
            </Box>

            <Box>
              <FormLabel>Address</FormLabel>
              <Input
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Your address"
              />
            </Box>
          </Stack>
        </Stack>
      </Box>
    </ChakraProvider>
  );
}

export default App;
