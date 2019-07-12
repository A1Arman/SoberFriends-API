import React from 'react';

const DreamDogsContext = React.createContext({
    posts: [],
    addPost: () => {},
    deletePost: () => {}
});

export const DreamDogsProvider = DreamDogsContext.Provider;
export const DreamDogsConsumer = DreamDogsContext.Consumer;