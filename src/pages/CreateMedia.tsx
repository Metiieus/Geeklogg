import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EditMediaPage } from './EditMediaContent';
import { MediaItem } from '../types';

const CreateMediaPage: React.FC = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    }

    const handleSave = (item: MediaItem) => {
        // Saved logic is inside EditMediaPage, which calls addMedia
        // item here is the saved item
        navigate('/library');
    }

    return (
        <EditMediaPage
            item={{}}
            onSave={handleSave}
            onBack={handleBack}
            isNew={true}
        />
    );
};

export default CreateMediaPage;
