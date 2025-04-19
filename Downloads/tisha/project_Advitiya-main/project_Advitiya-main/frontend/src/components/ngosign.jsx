'use client';

import { useState, useCallback, useEffect } from 'react';
import 'regenerator-runtime/runtime';
import { GoogleGenAI } from '@google/genai';
import { ChevronDownIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import axios from 'axios';

const ai = new GoogleGenAI({ apiKey: 'AIzaSyC2mhhO-NP_cA67iAKdnYTewZoReSka40E' });

// Initialize speech recognition
const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const speechRecognition = recognition ? new recognition() : null;

// Initialize speech synthesis
const synth = window.speechSynthesis;

export default function Ngosign() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    organization: '',
    email: '',
    password: '',
    phone_number: '',
    postal_code: '',
    colony: '',
    city: '',
    state: '',
    agreed_to_terms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);

  const showToast = (message, type = 'info') => {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 p-4 rounded-md ${type === 'error' ? 'bg-red-500' : type === 'success' ? 'bg-green-500' : 'bg-blue-500'
      } text-white shadow-lg transition-opacity duration-500`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => document.body.removeChild(toast), 500);
    }, 3000);
  };

  const speakWithCallback = useCallback((text, onEndCallback) => {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
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
    const messages = [
      "Welcome to Voice Form Fill!",
      "I'll help you fill out this form.",
      "Please tell me your name, email, phone number, and address clearly.",
      "Start speaking after the beep."
    ];

    for (const message of messages) {
      await speakWithCallback(message);
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    setIsListening(true);
    setTranscript('');
    if (speechRecognition) {
      speechRecognition.continuous = true;
      speechRecognition.interimResults = true;
      speechRecognition.start();
    }

    showToast("Start Speaking", "info");
  }, [speakWithCallback]);

  const processWithGemini = useCallback(async (text) => {
    try {
      setLoading(true);

      const prompt = `Extract the following information from this text and return it as a JSON object with these fields: 
        {
          "first_name": "",
          "last_name": "",
          "email": "",
          "phone_number": "",
          "postal_code": "",
          "colony": "",
          "city": "",
          "state": ""
        }
        If a field is not found, leave it empty. Here's the text to process: ${text}`;

      const response = await ai.models.generateContent({
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

      setFormData(prev => ({
        ...prev,
        ...extractedData
      }));

      await speakWithCallback("I've filled out the form with your information.");
      await speakWithCallback("Please check if everything is correct.");

      showToast("Form Updated", "success");
    } catch (error) {
      console.error('Error processing with Gemini:', error);
      await speakWithCallback("Sorry, I couldn't process your information. Please try again.");
      showToast(error.message || "Failed to process the voice input", "error");
    } finally {
      setLoading(false);
    }
  }, [speakWithCallback]);

  useEffect(() => {
    if (!speechRecognition) return;

    const handleResult = (event) => {
      const currentTranscript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join(' ');
      console.log('Current transcript:', currentTranscript);
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
      speechRecognition.onresult = null;
      speechRecognition.onend = null;
    };
  }, [isListening]);

  const handleStopListening = useCallback(() => {
    setIsListening(false);
    if (speechRecognition) {
      speechRecognition.stop();
    }

    console.log('Final transcript:', transcript);
    if (transcript) {
      processWithGemini(transcript);
    }
  }, [transcript, processWithGemini]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:8000/api/ngo/signup/', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.status === 'success') {
        setSuccess('Registration successful! Please check your email.');
        setFormData({
          first_name: '',
          last_name: '',
          organization: '',
          email: '',
          password: '',
          phone_number: '',
          postal_code: '',
          colony: '',
          city: '',
          state: '',
          agreed_to_terms: false
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8 relative">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
          NGO Registration
        </h2>
        <p className="mt-2 text-lg leading-8 text-gray-600">
          Join our network of organizations making a difference in the world.
        </p>
      </div>

      {error && (
        <div className="mx-auto mt-4 max-w-xl text-center text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mx-auto mt-4 max-w-xl text-center text-green-600">
          {success}
        </div>
      )}

      <div className="mx-auto mt-8 max-w-xl text-center">
        <button
          type="button"
          onClick={isListening ? handleStopListening : startProcess}
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {isListening ? 'Stop Voice Input' : 'Start Voice Input'}
        </button>
        {transcript && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">Transcript: {transcript}</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mx-auto mt-16 max-w-xl sm:mt-20">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label htmlFor="first_name" className="block text-sm font-semibold leading-6 text-gray-900">
              First name
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="first_name"
                id="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="last_name" className="block text-sm font-semibold leading-6 text-gray-900">
              Last name
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="last_name"
                id="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="organization" className="block text-sm font-semibold leading-6 text-gray-900">
              Organization Name
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="organization"
                id="organization"
                value={formData.organization}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900">
              Email
            </label>
            <div className="mt-2.5">
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="password" className="block text-sm font-semibold leading-6 text-gray-900">
              Password
            </label>
            <div className="mt-2.5 relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                required
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                title="Must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character"
                className="block w-full rounded-md border-0 px-3.5 py-2 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="phone_number" className="block text-sm font-semibold leading-6 text-gray-900">
              Phone number
            </label>
            <div className="mt-2.5">
              <input
                type="tel"
                name="phone_number"
                id="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                required
                pattern="^\+?[1-9]\d{9,14}$"
                title="Please enter a valid phone number"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="+919876543210"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="postal_code" className="block text-sm font-semibold leading-6 text-gray-900">
              Postal Code
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="postal_code"
                id="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
                required
                pattern="^\d{6}$"
                title="Please enter a valid 6-digit postal code"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="colony" className="block text-sm font-semibold leading-6 text-gray-900">
              Colony/Area
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="colony"
                id="colony"
                value={formData.colony}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-semibold leading-6 text-gray-900">
              City
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="city"
                id="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-semibold leading-6 text-gray-900">
              State
            </label>
            <div className="mt-2.5">
              <select
                name="state"
                id="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="">Select State</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Delhi">Delhi</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <div className="flex items-center gap-x-3">
            <input
              type="checkbox"
              name="agreed_to_terms"
              id="agreed_to_terms"
              checked={formData.agreed_to_terms}
              onChange={handleChange}
              required
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
            <label htmlFor="agreed_to_terms" className="text-sm leading-6 text-gray-600">
              By selecting this, you agree to our{' '}
              <a href="#" className="font-semibold text-indigo-600">
                privacy&nbsp;policy
              </a>
              .
            </label>
          </div>
        </div>

        <div className="mt-10">
          <button
            type="submit"
            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Register NGO
          </button>
        </div>
      </form>
    </div>
  );
}