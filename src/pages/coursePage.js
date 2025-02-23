import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { coursesService } from '../services/coursesService';
import { enrollInCourse } from "../redux/slices/userSlice";
import { updateCourse } from "../redux/slices/coursesSlice";

const CoursePage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [enrolling, setEnrolling] = useState(false);
  const [expandedWeek, setExpandedWeek] = useState(null);

  // Subscribe to single course updates
  useEffect(() => {
    const unsubscribe = coursesService.subscribeToCourse(id, (course) => {
      if (course) {
        dispatch(updateCourse(course));
      }
    });

    return () => unsubscribe();
  }, [id, dispatch]);

  const course = useSelector((state) => 
    state.courses.find((c) => c.id === id)
  );

  if (!course) return <div className="p-6">Course not found</div>;

  const isEnrolled = user.enrolledCourses.some(c => c.courseId === course.id);

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      const studentData = {
        id: user.id,
        name: user.name,
        email: user.email,
        enrollmentDate: new Date().toISOString()
      };

      await coursesService.updateCourseEnrollment(course.id, studentData);
      dispatch(enrollInCourse(course.id));
    } catch (error) {
      console.error('Error enrolling in course:', error);
    } finally {
      setEnrolling(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open':
        return 'bg-green-100 text-green-800';
      case 'Closed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const handleLikeToggle = async () => {
    try {
      await coursesService.toggleCourseLike(course.id, user.id);
      // No need to manually update state as Firebase will trigger real-time update
    } catch (error) {
      console.error('Error toggling course like:', error);
    }
  };

  const isLiked = course?.likedBy?.includes(user.id);

  const EnrollmentButton = () => {
    if (isEnrolled) {
      return (
        <div className="bg-green-100 text-green-800 px-6 py-3 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          Enrolled
        </div>
      );
    }

    if (course.enrollmentStatus === 'Closed') {
      return (
        <button
          disabled
          className="w-full bg-gray-300 text-gray-500 px-6 py-3 rounded-lg cursor-not-allowed"
        >
          Enrollment Closed
        </button>
      );
    }

    return (
      <button
        onClick={handleEnroll}
        disabled={enrolling}
        className={`w-full px-6 py-3 rounded-lg text-white font-medium
          ${enrolling 
            ? 'bg-blue-400 cursor-wait' 
            : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-105 transition-all'
          }`}
      >
        {enrolling ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Enrolling...
          </div>
        ) : (
          'Enroll Now'
        )}
      </button>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Course Header */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{course.name}</h1>
              <p className="text-blue-100">Taught by {course.instructor}</p>
            </div>
            <button
              onClick={handleLikeToggle}
              className="flex items-center space-x-1 bg-white bg-opacity-20 hover:bg-opacity-30 transition-all rounded-full px-4 py-2"
            >
              {isLiked ? (
                <HeartSolid className="h-5 w-5 text-red-500" />
              ) : (
                <HeartOutline className="h-5 w-5 text-white" />
              )}
              <span className="text-white">{course.likes || 0}</span>
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {/* Enrollment Status and Action */}
          <div className="flex justify-between items-center mb-6">
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(course.enrollmentStatus)}`}>
              {course.enrollmentStatus}
            </span>
            <div className="w-48">
              <EnrollmentButton />
            </div>
          </div>

          {/* Course Description */}
          <div className="prose max-w-none mb-6">
            <h2 className="text-xl font-semibold mb-3">About this Course</h2>
            <p className="text-purple-600">{course.description}</p>
          </div>

          {/* Course Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-red-50 rounded-lg p-4">
              <h3 className="font-semibold text-purple-700 mb-2">Duration</h3>
              <p className="text-purple-600">{course.duration}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="font-semibold text-purple-700 mb-2">Schedule</h3>
              <p className="text-purple-600">{course.schedule}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="font-semibold text-purple-700 mb-2">Location</h3>
              <p className="text-purple-600">{course.location}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="font-semibold text-purple-700 mb-2">Prerequisites</h3>
              <div className="flex flex-wrap gap-2">
                {course.prerequisites.map((prereq, index) => (
                  <span 
                    key={index}
                    className="bg-white text-purple-700 px-3 py-1 rounded-full text-sm border border-gray-200"
                  >
                    {prereq}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Syllabus Section */}
          <div className="border rounded-lg overflow-hidden">
            <h2 className="text-xl font-semibold p-6 bg-purple-50 border-b">
              Course Syllabus
            </h2>
            <div className="divide-y">
              {course.syllabus.map((week) => (
                <div key={week.week} className="bg-white">
                  <button
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-purple-50 transition-colors"
                    onClick={() => setExpandedWeek(expandedWeek === week.week ? null : week.week)}
                  >
                    <div className="flex items-center">
                      <span className="text-blue-600 font-medium mr-2">Week {week.week}</span>
                      <span className="font-medium">{week.topic}</span>
                    </div>
                    {expandedWeek === week.week ? (
                      <ChevronUpIcon className="w-5 h-5 text-purple-500" />
                    ) : (
                      <ChevronDownIcon className="w-5 h-5 text-purple-500" />
                    )}
                  </button>
                  {expandedWeek === week.week && (
                    <div className="px-6 py-4 bg-gray-50">
                      <p className="text-purple-600">{week.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;