import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import {CircularProgress} from "@mui/material";

const RemoveBgPage: React.FC = () => {
    const [image, setImage] = useState<File | null>(null);
    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setImage(event.target.files[0]);
            setError(null);  // Reset error state on new upload
        }
    };

    const removeBackground = async () => {
        if (!image) return;

        setLoading(true);
        setError(null);  // Reset error state before processing

        const formData = new FormData();
        formData.append('image_file', image);

        try {
            const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-Api-Key': 'YOUR_API_KEY'
                },
                responseType: 'blob',
            });

            const blob = new Blob([response.data]);
            const url = URL.createObjectURL(blob);
            setProcessedImage(url);
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                setError('Erreur lors de la suppression de l\'arrière-plan. Veuillez réessayer.');
                console.error('Erreur axios:', error.response?.data);
            } else {
                setError('Une erreur inattendue est survenue.');
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

                <motion.div
                    className="border-dashed border-4 border-blue-600 p-6 rounded-lg hover:border-blue-700 transition cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="fileUpload"
                    />
                    <label htmlFor="fileUpload" className="cursor-pointer">
                        {image ? (
                            <p>{image.name}</p>
                        ) : (
                            <p>Glissez-déposez une image ou cliquez pour télécharger</p>
                        )}
                    </label>
                </motion.div>

                {error && <p className="mt-4 text-red-400">{error}</p>}

                <motion.button
                    onClick={removeBackground}
                    className={`px-8 py-3 mt-6 rounded-full text-lg font-semibold transition ${
                        loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                    whileHover={{ scale: !loading ? 1.1 : 1 }}
                    disabled={!image || loading}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Effacer l\'arrière-plan'}
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
                    <motion.img
                        src={processedImage}
                        alt="Image Traîtée"
                        className="max-h-[300px] max-w-full h-auto rounded-lg shadow-lg"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                    />
                    <a
                        href={processedImage}
                        download="image-sans-fond.png"
                        className="block mt-4 text-blue-400 underline hover:text-blue-600 transition"
                    >
                        Télécharger l'image
                    </a>
                </motion.div>
            )}
        </div>
    );
};

export default RemoveBgPage;
