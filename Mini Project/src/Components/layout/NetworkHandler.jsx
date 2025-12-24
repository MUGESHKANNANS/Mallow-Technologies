import React, { useEffect } from 'react';
import { message } from 'antd';

const NetworkHandler = () => {
    useEffect(() => {
        const handleOffline = () => {
            message.destroy();
            message.error({
                content: "You are offline. Please check your internet connection",
                duration: 5, 
                key: 'network_status'
            });
        };

        const handleOnline = () => {
            message.destroy();
            message.success({
                content: "You are back online",
                duration: 2,
                key: 'network_status'
            });
        };

        window.addEventListener('offline', handleOffline);
        window.addEventListener('online', handleOnline);

        if (!navigator.onLine) {
            handleOffline();
        }

        return () => {
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('online', handleOnline);
        };
    }, []);

    return null;
};

export default NetworkHandler;
