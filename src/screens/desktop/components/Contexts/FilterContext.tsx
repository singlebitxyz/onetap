import { ReactNode, useContext, useState } from "react";
import { createContext } from "react";

// Define the type for the active route
interface FilterContextValue {
    gameId: number;
    handleFilterChange: (newGameId: number) => void;
  }
  
  // Create the typed context with the defined interface
  export const FilterContext = createContext<FilterContextValue>({
    gameId: 0,
    handleFilterChange: () => {}
  });
  
  
  export const FilterProvider = ({children}:{children:ReactNode})=>{
    const [gameId, setGameId] = useState(0)
  
    const handleFilterChange = (newGameId:number)=>{
      setGameId(newGameId)
    }
  
    return (
      <FilterContext.Provider value={{ gameId, handleFilterChange }}>
        {children}
      </FilterContext.Provider>
    );
  }
  
  export const useFilterContext = ()=>{
    const {gameId, handleFilterChange} = useContext(FilterContext);
    return {gameId, handleFilterChange};
  }