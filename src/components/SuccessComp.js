import React from 'react';

const SuccessComp = ( {msg} ) => {
    return (
        <div className={`text-gray-400 text-sm`}>
            {msg}
        </div>
    );
};

export default SuccessComp;