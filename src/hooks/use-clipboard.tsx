
export const useClipboard = () => {

    const copy = async (text: string) => {
  
      try {
  
        await navigator.clipboard.writeText(text);
  
        return true;
  
      } catch (err) {
  
        console.error('Failed to copy text: ', err);
  
        return false;
  
      }
  
    };
  
  
  
    return { copy };
  
  };
  