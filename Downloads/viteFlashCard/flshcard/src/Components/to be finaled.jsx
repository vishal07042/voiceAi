import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import flashcardData from './FlashCard.json';

const images = [
    '/src/assets/marvelChars/Thor_01_Foreground_Common.png',
    '/src/assets/marvelChars/Deadpool_03_Foreground_Common.png',
    '/src/assets/marvelChars/Spider-Man_01_Foreground_Common.png',
    '/src/assets/marvelChars/Thor_01_Foreground_Common.png',
    '/src/assets/marvelChars/Deadpool_03_Foreground_Common.png',
    '/src/assets/marvelChars/Spider-Man_01_Foreground_Common.png',
    '/src/assets/marvelChars/Iron-Man_01_Foreground_Common.png',
    '/src/assets/marvelChars/Hulk_01_Foreground_Common.png',
    '/src/assets/marvelChars/Captain-America_01_Foreground_Common.png',
    '/src/assets/marvelChars/Wolverine_01_Foreground_Common.png',
    '/src/assets/marvelChars/Black-Widow_01_Foreground_Common.png',
    '/src/assets/marvelChars/Black-Panther_01_Foreground_Common.png',
    '/src/assets/marvelChars/Doctor-Strange_01_Foreground_Common.png',
    '/src/assets/marvelChars/Quicksilver_01_Foreground_Common.png',
    '/src/assets/marvelChars/Thanos_01_Foreground_Common.png',
    '/src/assets/marvelChars/Ant-Man_01_Foreground_Common.png',
    '/src/assets/marvelChars/Deadpool_03_Foreground_Common.png',
    '/src/assets/marvelChars/Captain_Marvel_01_Foreground_Common.png',
    '/src/assets/marvelChars/Groot_01_Foreground_Common.png',
    '/src/assets/marvelChars/Black_Panther_01_Foreground_Common.png',
    '/src/assets/marvelChars/Iron_Man_01_Foreground_Common.png',
    '/src/assets/marvelChars/Captain_America_01_Foreground_Common.png',
    '/src/assets/marvelChars/Hulk_01_Foreground_Common.png',
    '/src/assets/marvelChars/Black_Widow_01_Foreground_Common.png',
    '/src/assets/marvelChars/Thor_01_Foreground_Common.png',
    '/src/assets/marvelChars/Doctor-Strange_01_Foreground_Common.png',
    '/src/assets/marvelChars/Quicksilver_01_Foreground_Common.png',
    '/src/assets/marvelChars/Thanos_01_Foreground_Common.png',
    '/src/assets/marvelChars/Ant-Man_01_Foreground_Common.png',
    '/src/assets/marvelChars/Deadpool_03_Foreground_Common.png',
    '/src/assets/marvelChars/Captain_Marvel_01_Foreground_Common.png',
    '/src/assets/marvelChars/Groot_01_Foreground_Common.png',
    // Add more image paths here
];

// Simple hash function to map flashcard id to an image index
const hashIdToImageIndex = (id) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % images.length;
};

const Flashcard = ({ id, topic, points, color, image, hero, isActive }) => (
    <div
        className={`card2 w-72 h-108 rounded-xl shadow-lg p-4 bg-gradient-to-br ${color} text-white absolute
    ${isActive ? 'z-10 scale-125' : 'scale-95 opacity-70'}`}
        style={{
            transform: isActive ? 'rotate(-5deg)' : 'rotate(0deg)',
            transition: 'all 0.3s ease',
        }}
    >
        <div className="relative flex justify-center items-center h-48 mb-4">
            {/* Superhero Image */}
            <img src={image} alt={hero} className="absolute top-0 h-40 w-auto" />
        </div>
        <div className="flex justify-between items-start">
            <span className="text-2xl font-bold">{id}</span>
            <div className="bg-white text-black rounded-full p-1 text-xs">
                +{points}
            </div>
        </div>
        <div className="mt-8">
            <h2 className="text-xl font-bold uppercase">{topic}</h2>
            <p className="text-sm mt-2">Master this algorithm to level up!</p>
        </div>
    </div>
);

const DSAFlashcards = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [bgColor, setBgColor] = useState('bg-purple-500');
    const [flashcards, setFlashcards] = useState([]);

    useEffect(() => {
        const colors = ['bg-purple-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500'];
        const intervalId = setInterval(() => {
            setBgColor(colors[Math.floor(Math.random() * colors.length)]);
        }, 3000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        // Set a random initial index
        setCurrentIndex(Math.floor(Math.random() * flashcardData.length));

        // Assign images to flashcards based on their id
        const flashcardsWithImages = flashcardData.map(card => ({
            ...card,
            image: images[hashIdToImageIndex(card.id)]
        }));
        setFlashcards(flashcardsWithImages);
    }, []);

    const nextCard = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
    };

    const prevCard = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length);
    };

    const getCardIndex = (offset) => {
        return (currentIndex + offset + flashcards.length) % flashcards.length;
    };

    return (
        <div className={`flex items-center justify-center min-h-screen ${bgColor} transition-colors duration-1000`}>
            <button onClick={prevCard} className="mr-4 text-white z-20">
                <ChevronLeft size={24} />
            </button>
            <div className="relative flex justify-center items-center w-full h-full">
                <AnimatePresence>
                    {[-1, 0, 1].map((offset) => (
                        <motion.div
                            key={getCardIndex(offset)}
                            initial={{ opacity: 0, x: 100 * offset }}
                            animate={{ opacity: 1, x: 20 * offset }}
                            exit={{ opacity: 0, x: -100 * offset }}
                            transition={{ duration: 0.3 }}
                            style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
                        >
                            <Flashcard {...flashcards[getCardIndex(offset)]} isActive={offset === 0} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            <button onClick={nextCard} className="ml-4 text-white z-20">
                <ChevronRight size={24} />
            </button>
        </div>
    );
};

export default DSAFlashcards;
