import React from 'react';
import NavigationBar from './Navbar';

const ViewApps = () => {
    return (
        <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center p-4">
            <NavigationBar />
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold">View Products</h1>
            </div>
        </div>
    );
};

export default ViewApps;
