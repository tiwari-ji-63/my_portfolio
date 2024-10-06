import React from 'react';

function Card({title, subtitle, description, image, link, githubLink}) {
    return (
        <div className="flex items-center justify-center gap-10 sm:flex-col">
            {image && <img src={image} alt={title} className="h-96 w-auto sm:h-auto sm:w-96"/>}
            <div className="flex flex-col gap-5">
                <h1 className="text-secondary text-xl">{title}</h1>
                {subtitle && <h1 className="text-white text-xl">{subtitle}</h1>}
                <p className="text-tertiary scrollable-description">{description}</p>
                <div className="flex gap-4">
                    {link && (
                        <button
                            className="border-2 border-tertiary text-tertiary w-48 px-4 py-2 rounded hover:border-secondary hover:text-white"
                            onClick={() => window.open(link, "_blank")}
                        >
                            Visit Project
                        </button>
                    )}
                    {githubLink && (
                        <button
                            className="border-2 border-tertiary text-tertiary w-48 px-4 py-2 rounded hover:border-secondary hover:text-white"
                            onClick={() => window.open(githubLink, "_blank")}
                        >
                            Github Link
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Card;