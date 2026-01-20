import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { API_BASE_URL } from '../config/api';

const DogContext = createContext();

export const DogProvider = ({ children }) => {
    const { user } = useAuth();
    const [dogs, setDogs] = useState([]);
    const [favoriteIds, setFavoriteIds] = useState([]);
    const [loading, setLoading] = useState(true);

    const userId = user?.id || 'guest';

    // Fetch all dogs and user's favorites on mount or user change
    useEffect(() => {
        const fetchData = async () => {
            if (!user || !user.id) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const responses = await Promise.all([
                    fetch(`${API_BASE_URL}/dogs`).catch(err => ({ ok: false, error: err })),
                    fetch(`${API_BASE_URL}/favorites/${user.id}`).catch(err => ({ ok: false, error: err }))
                ]);

                const dogsRes = responses[0];
                const favsRes = responses[1];

                if (dogsRes.ok && favsRes.ok) {
                    const dogsData = await dogsRes.json();
                    const favsData = await favsRes.json();
                    setDogs(dogsData);
                    setFavoriteIds(favsData.map(f => f.dog_id));
                } else {
                    console.error("Fetch failed:", dogsRes.error || favsRes.error);
                }
            } catch (error) {
                console.error("Error in fetchData:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user?.id]); // 只依赖 user.id，避免重复触发

    const toggleFavorite = async (dogId) => {
        try {
            const res = await fetch(`${API_BASE_URL}/favorites`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, dogId })
            });
            const result = await res.json();

            if (result.status === 'added') {
                setFavoriteIds(prev => [...prev, dogId]);
            } else if (result.status === 'removed') {
                setFavoriteIds(prev => prev.filter(id => id !== dogId));
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
        }
    };

    const favorites = dogs.filter(dog => favoriteIds.includes(dog.id));

    return (
        <DogContext.Provider value={{ DOGS: dogs, favoriteIds, favorites, toggleFavorite, loading }}>
            {children}
        </DogContext.Provider>
    );
};

export const useDogs = () => useContext(DogContext);
