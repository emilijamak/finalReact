import React from 'react';

const ErrorComp = ( {error} ) => {
    return (
        <div className={`text-gray-400 text-sm`}>
            {error}
        </div>
    );
};


export default ErrorComp;