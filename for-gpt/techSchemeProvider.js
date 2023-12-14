import React, { useState, createContext, useContext } from "react";
import { useNodesState, useEdgesState } from "reactflow";

const TechSchemeStateContext = createContext();
const TechSchemeDispatchContext = createContext();

function TechSchemeProvider({ children }) {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [content, setContent] = useState("Новая схема");
    const val = { nodes, edges, content };
    const dispatch = {
        setNodes,
        onNodesChange,
        setEdges,
        onEdgesChange,
        setContent,
    };

    return (
        <TechSchemeStateContext.Provider value={val}>
            <TechSchemeDispatchContext.Provider value={dispatch}>
                {children}
            </TechSchemeDispatchContext.Provider>
        </TechSchemeStateContext.Provider>
    );
}

function useTechSchemeState() {
    const context = useContext(TechSchemeStateContext);
    if (context === undefined) {
        throw new Error(
            "usetechSchemeState must be used within a techSchemeProvider"
        );
    }
    return context;
}

function useTechSchemeDispatch() {
    const context = useContext(TechSchemeDispatchContext);
    if (context === undefined) {
        throw new Error(
            "usetechSchemeDispatch must be used within a techSchemeProvider"
        );
    }
    return context;
}

export { TechSchemeProvider, useTechSchemeState, useTechSchemeDispatch };
