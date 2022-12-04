import { useEffect } from 'react';

export default function useOutsideClickHandler(
  ref: any,
  onClick: () => void,
  secondaryRef?: any
) {
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        if (secondaryRef && !secondaryRef.current.contains(event.target))
          onClick();
        else if (!secondaryRef) onClick();
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
}
