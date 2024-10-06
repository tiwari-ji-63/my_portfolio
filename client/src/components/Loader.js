import React from 'react'

function Loader() {
    return (
        <div className="h-screen flex items-center justify-center fixed inset-0 bg-primary z-[10000]">
            <div className="flex gap-5 text-6xl font-semibold sm:text-3xl">
                <h1 className="text-secondary first_letter">A</h1>
                <h1 className="text-white second_letter">K</h1>
                <h1 className="text-tertiary third_letter">T</h1>
            </div>
        </div>
    )
}

export default Loader