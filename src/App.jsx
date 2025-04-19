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
  VStack,
  Container,
  Center,
} from '@chakra-ui/react';
import { FaMicrophone, FaMicrophoneSlash, FaPlay } from 'react-icons/fa';

// Initialize Gemini AI with proper configuration
const genAI = new GoogleGenAI({ apiKey: 'AIzaSyC2mhhO-NP_cA67iAKdnYTewZoReSka40E' });

// Initialize speech recognition
const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const speechRecognition = recognition ? new recognition() : null;

// Initialize speech synthesis
const synth = window.speechSynthesis;

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
  const [hasStarted, setHasStarted] = useState(false);
  const toast = useToast();

  const speakWithCallback = useCallback((text, onEndCallback) => {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Slightly slower rate for better clarity
      utterance.pitch = 1;

      utterance.onend = () => {
        if (onEndCallback) {
          onEndCallback();
        }
        resolve();
      };

      synth.speak(utterance);
    });
  }, []);

  const startProcess = useCallback(async () => {
    setHasStarted(true);

    // Welcome sequence
    const messages = [
      "Welcome to Voice Form Fill!",
      "I'll help you fill out this form.",
      "Please tell me your name, email, phone number, and address clearly.",
      "Start speaking after the beep."
    ];

    // Speak each message in sequence
    for (const message of messages) {
      await speakWithCallback(message);
      // Small pause between messages
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    // Start listening after messages are done
    setIsListening(true);
    setTranscript('');
    if (speechRecognition) {
      speechRecognition.continuous = true;
      speechRecognition.interimResults = true;
      speechRecognition.start();
    }

    toast({
      title: "Start Speaking",
      description: "Please say your information clearly.",
      status: "info",
      duration: 5000,
      isClosable: true,
    });
  }, [speakWithCallback, toast]);

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
        console.log('AI Response:', responseText); // Debug log
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        extractedData = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(responseText);
        console.log('Extracted Data:', extractedData); // Debug log
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        throw new Error('Failed to parse the AI response');
      }

      setFormData(prev => {
        console.log('Updating form data:', extractedData); // Debug log
        return { ...prev, ...extractedData };
      });

      // Confirm the information via voice
      await speakWithCallback("I've filled out the form with your information.");
      await speakWithCallback("Please check if everything is correct.");

      toast({
        title: "Form Updated",
        description: "The form has been filled with the extracted information.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error processing with Gemini:', error);
      await speakWithCallback("Sorry, I couldn't process your information. Please try again.");
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
  }, [toast, speakWithCallback]);

  useEffect(() => {
    if (!speechRecognition) return;

    const handleResult = (event) => {
      const currentTranscript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join(' ');
      console.log('Current transcript:', currentTranscript); // Debug log
      setTranscript(currentTranscript);
    };

    const handleEnd = () => {
      if (isListening) {
        speechRecognition.start();
      }
    };

    speechRecognition.onresult = handleResult;
    speechRecognition.onend = handleEnd;

    return () => {
      speechRecognition.stop();
      synth.cancel();

      // Cleanup event listeners
      speechRecognition.onresult = null;
      speechRecognition.onend = null;
    };
  }, [isListening]);

  const handleStopListening = useCallback(() => {
    setIsListening(false);
    if (speechRecognition) {
      speechRecognition.stop();
    }

    console.log('Final transcript:', transcript); // Debug log
    if (transcript) {
      processWithGemini(transcript);
    }
  }, [transcript, processWithGemini]);

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
      <Container maxW="800px" py={8}>
        <VStack spacing={8}>
          <Heading textAlign="center">Voice-Controlled Form</Heading>

          {!hasStarted ? (
            <Center py={10}>
              <Button
                size="lg"
                colorScheme="blue"
                leftIcon={<FaPlay />}
                onClick={startProcess}
                isLoading={loading}
              >
                Start Voice Assistant
              </Button>
            </Center>
          ) : (
            <>
              <Box textAlign="center" width="100%">
                <Button
                  leftIcon={isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
                  onClick={handleStopListening}
                  colorScheme={isListening ? "red" : "green"}
                  isLoading={loading}
                  size="lg"
                  mb={4}
                >
                  {isListening ? "I'm Done Speaking" : "Start Speaking"}
                </Button>

                {transcript && (
                  <Text mt={2} fontSize="sm" color="gray.600">
                    Transcript: {transcript}
                  </Text>
                )}
              </Box>

              <Stack spacing={4} as="form" width="100%">
                <Box>
                  <FormLabel>Name</FormLabel>
                  <Input
                    value={formData.name || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your name"
                  />
                </Box>

                <Box>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Your email"
                  />
                </Box>

                <Box>
                  <FormLabel>Phone</FormLabel>
                  <Input
                    value={formData.phone || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Your phone number"
                  />
                </Box>

                <Box>
                  <FormLabel>Address</FormLabel>
                  <Input
                    value={formData.address || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Your address"
                  />
                </Box>
              </Stack>
            </>
          )}
        </VStack>
      </Container>
    </ChakraProvider>
  );
}

export default App;
