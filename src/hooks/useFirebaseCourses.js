import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCourses } from '../redux/slices/coursesSlice';
import { coursesService } from '../services/coursesService';

export const useFirebaseCourses = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Subscribe to courses collection
    const unsubscribe = coursesService.subscribeToAllCourses((courses) => {
      dispatch(setCourses(courses));
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [dispatch]);
}; 