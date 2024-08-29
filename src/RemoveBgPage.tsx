import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const RemoveBgPage: React.FC = () => {
    const [image, setImage] = useState<File | null>(null);
    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setImage(event.target.files[0]);
        }
    };

    const removeBackground = async () => {
        if (!image) return;

        setLoading(true);

        const formData = new FormData();
        formData.append('image_file', image);  // Notez 'image_file' comme clé

        try {
            const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-Api-Key': 'erL1KFxjj9dz8GtbT8ULrAmR'
                },
                responseType: 'blob',
            });

            const blob = new Blob([response.data]);
            const url = URL.createObjectURL(blob);
            setProcessedImage(url);
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                console.error('Erreur axios:', error.response?.data);
            } else {
                console.error('Erreur:', error.message);
            }
        }


        setLoading(false);
    };


    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center">
            <header className="text-center">
                <motion.h1
                    className="text-5xl font-bold mb-4"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Effaceur de Fond d'Image ✨
                </motion.h1>
                <motion.p
                    className="text-lg mb-8 max-w-xl mx-auto"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    Téléchargez votre image et laissez-nous faire la magie en supprimant l'arrière-plan.
                </motion.p>

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="mb-4"
                />
                <motion.button
                    onClick={removeBackground}
                    className="px-8 py-3 bg-blue-600 rounded-full text-lg font-semibold hover:bg-blue-700 transition"
                    whileHover={{ scale: 1.1 }}
                    disabled={!image || loading}
                >
                    {loading ? 'Traitement...' : 'Effacer l\'arrière-plan'}
                </motion.button>
            </header>

            {processedImage && (
                <motion.div
                    className="mt-20 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-3xl font-bold mb-6">Image Traîtée</h2>
                    <img src={processedImage} alt="Image Traîtée" className="max-w-full h-auto rounded-lg shadow-lg" />
                    <a
                        href={processedImage}
                        download="image-sans-fond.png"
                        className="block mt-4 text-blue-400 underline"
                    >
                        Télécharger l'image
                    </a>
                </motion.div>
            )}
        </div>
    );
};

export default RemoveBgPage;
