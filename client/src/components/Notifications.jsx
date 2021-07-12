import React, { useContext } from 'react';
import { Button } from '@material-ui/core';

import { ContextConfig } from '../Context';

const Notifications = () => {
    const config = useContext(ContextConfig);

    return (
        <>
            {config.call.isReceivingCall && !config.acceptCall && (
                <div
                    style={{ display: 'flex', justifyContent: 'space-around' }}
                >
                    <h1>{config.call.name} is calling:</h1>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={config.answerCall}
                    >
                        Answer
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={config.hangUpCall}
                    >
                        Ignore
                    </Button>
                </div>
            )}
        </>
    );
};

export default Notifications;
