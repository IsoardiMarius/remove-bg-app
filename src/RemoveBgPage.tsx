import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { CircularProgress, Button, Box, Typography, Card, CardMedia } from '@mui/material';

const RemoveBgPage: React.FC = () => {
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isBgAlreadyRemoved, setIsBgAlreadyRemoved] = useState<boolean>(false);
    const [inputKey, setInputKey] = useState<number>(Date.now()); // Ajout d'une clé unique pour l'input

    useEffect(() => {
        if (imagePreview) {
            const img = new Image();
            img.src = imagePreview;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0);
                const data: any = ctx?.getImageData(0, 0, img.width, img.height).data;
                if (data) {
                    setIsBgAlreadyRemoved([...data].some((val, index) => index % 4 === 3 && val < 255));
                }
            };
        }
    }, [imagePreview]);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
            setProcessedImage(null);
            setError(null);
        }
    };

    const removeBackground = async () => {
        if (!image) return;

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('image_file', image);

        try {
            const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-Api-Key': process.env.REACT_APP_API_KEY
                },
                responseType: 'blob',
            });

            const blob = new Blob([response.data]);
            const url = URL.createObjectURL(blob);
            setProcessedImage(url);
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                setError('Erreur lors de la suppression de l\'arrière-plan. Veuillez réessayer plus tard.');
                console.error('Erreur axios:', error.response?.data);
            } else {
                setError('Une erreur inattendue est survenue.');
                console.error('Erreur:', error.message);
            }
        }

        setLoading(false);
    };

    const resetSelection = () => {
        setImage(null);
        setImagePreview(null);
        setProcessedImage(null);
        setError(null);
        setIsBgAlreadyRemoved(false);
        setInputKey(Date.now()); // Changer la clé de l'input pour permettre une nouvelle sélection
    };

    // Déterminer si le bouton doit être désactivé
    const isRemoveBgDisabled = !image || loading || isBgAlreadyRemoved || (image && processedImage);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4">
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
                {imagePreview && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center"
                    >
                        <Typography variant="h6" className="text-center mb-2 text-3xl !font-bold text-white">Image de base</Typography>
                        <Card className="w-[350px] rounded-lg" style={{ backgroundColor: 'transparent' }}>
                            <CardMedia
                                component="img"
                                className="object-contain p-4 rounded-lg"
                                image={imagePreview}
                                alt="Aperçu de l'image originale"
                                style={{ height: '350px' }}
                            />
                        </Card>
                    </motion.div>
                )}

                <Box className="bg-gray-900 p-8 rounded-lg shadow-lg text-center flex flex-col justify-center" style={{ width: '500px' }}>
                    <motion.h1
                        className="text-3xl font-bold text-white mb-4"
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        Effaceur de Fond d'Image ✨
                    </motion.h1>
                    <motion.p
                        className="text-lg text-gray-300 mb-8"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Téléchargez votre image et laissez-nous faire la magie en supprimant l'arrière-plan.
                    </motion.p>

                    <motion.div
                        className="border-dashed border-4 border-gray-600 p-8 rounded-lg hover:border-gray-500 transition cursor-pointer mb-6"
                        whileHover={{ scale: 1.02 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <input
                            key={inputKey} // Utiliser la clé pour forcer le rechargement de l'input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="fileUpload"
                        />
                        <label htmlFor="fileUpload" className="cursor-pointer text-gray-400">
                            {image ? (
                                <p>{image.name}</p>
                            ) : (
                                <p>Glissez-déposez une image ou cliquez pour télécharger</p>
                            )}
                        </label>
                    </motion.div>

                    {error && <p className="mt-4 text-red-400">{error}</p>}

                    <Box className="flex justify-center space-x-4 mt-4">
                        <motion.button
                            onClick={removeBackground}
                            className={`px-6 py-2 rounded-md text-base font-medium text-white transition ${
                                isRemoveBgDisabled ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                            whileHover={{ scale: !isRemoveBgDisabled ? 1.05 : 1 }}
                            disabled={isRemoveBgDisabled !== null}
                        >
                            {loading ? <CircularProgress size={20} color="inherit" /> : 'Effacer l\'arrière-plan'}
                        </motion.button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={resetSelection}
                            disabled={!image || loading}
                            className="px-6 py-2 rounded-md text-base font-medium border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-white"
                        >
                            Déselectionner
                        </Button>
                    </Box>
                </Box>

                {processedImage && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center"
                    >
                        <Typography variant="h6" className="text-center mb-2 text-3xl !font-bold text-white">Image sans arrière-plan</Typography>
                        <Card className="w-[350px] rounded-lg" style={{ backgroundColor: 'transparent' }}>
                            <CardMedia
                                component="img"
                                className="object-contain p-4 rounded-lg"
                                image={processedImage}
                                alt="Image Traîtée"
                                style={{ height: '350px' }}
                            />
                            <Button
                                variant="contained"
                                href={processedImage}
                                download="image-sans-fond.png"
                                className="w-full !bg-blue-500 hover:bg-blue-700"
                            >
                                Télécharger l'image
                            </Button>
                        </Card>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default RemoveBgPage;
