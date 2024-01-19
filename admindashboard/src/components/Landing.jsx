import React from "react";
import NavigationBar from "./Navbar";
import { useEmbeddedWalletUserEmail } from "@thirdweb-dev/react";

const LandingPage = () => {
    // Dummy data for cards
    const cards = [
        {
            id: 1,
            title: "Card Title 1",
            description: "This is a description for card 1.",
            imageUrl: "https://via.placeholder.com/150", // Replace with actual image URL
        },
        {
            id: 2,
            title: "Card Title 2",
            description: "This is a description for card 2.",
            imageUrl: "https://via.placeholder.com/150", // Replace with actual image URL
        },
        {
            id: 3,
            title: "Card Title 3",
            description: "This is a description for card 3.",
            imageUrl: "https://via.placeholder.com/150", // Replace with actual image URL
        },
    ];

    const repeatedCards = [...cards, ...cards, ...cards];

    return (
        <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center p-4">
            <NavigationBar />

            <h2 className="text-2xl font-bold mb-4 text-center animate-pulse">
                Welcome to GhoPe
            </h2>

            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4 ">
                {repeatedCards.map((card) => (
                    <div
                        key={card.id}
                        className="bg-gray-600 rounded-lg shadow-lg p-4 hover:bg-gray-500 transition duration-300 ease-in-out"
                    >
                        <img
                            src={card.imageUrl}
                            alt={card.title}
                            className="rounded-md mb-3"
                        />
                        <h3 className="text-xl font-semibold">{card.title}</h3>
                        <p>{card.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LandingPage;
