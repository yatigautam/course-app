import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { markCourseCompleted, updateCourseProgress } from "../redux/slices/userSlice";

const Dashboard = () => {
  const user = useSelector((state) => state.user);
  const courses = useSelector((state) => state.courses);
  const dispatch = useDispatch();
  const [editingProgress, setEditingProgress] = useState(null);
  const [customProgress, setCustomProgress] = useState("");

  // Filter enrolled and completed courses
  const enrolledCourses = courses.filter(course => 
    user.enrolledCourses.some(enrolled => enrolled.courseId === course.id)
  );

  const completedCourses = enrolledCourses.filter(course => 
    user.enrolledCourses.find(enrolled => enrolled.courseId === course.id)?.progress === 100
  );

  const getProgress = (courseId) => {
    const enrolledCourse = user.enrolledCourses.find(c => c.courseId === courseId);
    return enrolledCourse ? enrolledCourse.progress : 0;
  };

  // Calculate overall progress
  const calculateOverallProgress = () => {
    if (enrolledCourses.length === 0) return 0;
    const totalProgress = user.enrolledCourses.reduce((acc, course) => acc + course.progress, 0);
    return Math.round(totalProgress / user.enrolledCourses.length);
  };

  const handleMarkCompleted = (courseId) => {
    dispatch(markCourseCompleted(courseId));
  };

  const handleProgressUpdate = (courseId, progress) => {
    dispatch(updateCourseProgress({ courseId, progress }));
    setEditingProgress(null);
    setCustomProgress("");
  };

  const ProgressUpdateMenu = ({ courseId, currentProgress }) => {
    const predefinedOptions = [25, 50, 75, 100];

    return (
      <div className="absolute right-0 top-12 bg-white rounded-lg shadow-lg p-4 z-10 w-64 border">
        <h4 className="text-sm font-semibold mb-3">Update Progress</h4>
        
        {/* Predefined options */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {predefinedOptions.map((option) => (
            <button
              key={option}
              onClick={() => handleProgressUpdate(courseId, option)}
              className={`px-3 py-2 text-sm rounded-md transition-colors
                ${currentProgress === option 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'hover:bg-gray-100'}`}
            >
              {option}%
            </button>
          ))}
        </div>

        {/* Custom input */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            max="100"
            value={customProgress}
            onChange={(e) => setCustomProgress(e.target.value)}
            className="w-20 px-2 py-1 border rounded-md"
            placeholder="Custom"
          />
          <button
            onClick={() => {
              const progress = parseInt(customProgress);
              if (progress >= 0 && progress <= 100) {
                handleProgressUpdate(courseId, progress);
              }
            }}
            disabled={!customProgress || customProgress < 0 || customProgress > 100}
            className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 
              disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Set
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* User Stats Section */}
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Welcome back, {user.name}!</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-700">Enrolled Courses</h3>
            <p className="text-3xl font-bold text-blue-900">{enrolledCourses.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-700">Completed Courses</h3>
            <p className="text-3xl font-bold text-green-900">{completedCourses.length}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-700">Overall Progress</h3>
            <p className="text-3xl font-bold text-purple-900">{calculateOverallProgress()}%</p>
          </div>
        </div>
      </div>

      {/* Completed Courses Section */}
      {completedCourses.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Completed Courses</h2>
          <div className="grid grid-cols-1 gap-6">
            {completedCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
                    <p className="text-gray-600">{course.instructor}</p>
                  </div>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Completed
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Completed on: {user.enrolledCourses.find(c => c.courseId === course.id)?.enrollmentDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* In Progress Courses Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Courses In Progress</h2>
        <div className="grid grid-cols-1 gap-6">
          {enrolledCourses
            .filter(course => getProgress(course.id) < 100)
            .map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
                    <p className="text-gray-600">{course.instructor}</p>
                  </div>
                  <div className="mt-2 md:mt-0 flex items-center gap-2">
                    <button
                      onClick={() => handleMarkCompleted(course.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Mark as Completed
                    </button>
                  </div>
                </div>

                {/* Progress Bar with Update Option */}
                <div className="mb-4 relative">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">{getProgress(course.id)}%</span>
                      <button
                        onClick={() => setEditingProgress(editingProgress === course.id ? null : course.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${getProgress(course.id)}%` }}
                    ></div>
                  </div>
                  {editingProgress === course.id && (
                    <ProgressUpdateMenu 
                      courseId={course.id}
                      currentProgress={getProgress(course.id)}
                    />
                  )}
                </div>

                {/* Course Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{course.schedule}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;