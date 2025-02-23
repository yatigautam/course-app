import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useFirebaseCourses } from '../hooks/useFirebaseCourses';


const HomePage = () => {
  useFirebaseCourses();
  const courses = useSelector((state) => state.courses);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter courses based on search query
  const filteredCourses = courses.filter(course => {
    const query = searchQuery.toLowerCase();
    return (
      course.name.toLowerCase().includes(query) ||
      course.instructor.toLowerCase().includes(query)
    );
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search courses by name or instructor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-10 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg 
              className="h-5 w-5 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <svg 
                className="h-5 w-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
        {/* Search Results Count */}
        <div className="mt-2 text-sm text-gray-600">
          {searchQuery && (
            <p>
              Found {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'}
            </p>
          )}
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-8">Available Courses</h1>
      
      {/* No Results Message */}
      {searchQuery && filteredCourses.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <svg 
              className="mx-auto h-12 w-12" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No courses found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search terms or browse all courses
          </p>
        </div>
      )}

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              {/* Course Header */}
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">
                  <Link to={`/course/${course.id}`} className="text-blue-600 hover:text-blue-800">
                    {course.name}
                  </Link>
                </h2>
                <p className="text-gray-600 font-medium">{course.instructor}</p>
              </div>

              {/* Course Status Badge */}
              <div className="mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium
                  ${course.enrollmentStatus === 'Open' ? 'bg-green-100 text-green-800' : 
                    course.enrollmentStatus === 'Closed' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'}`}>
                  {course.enrollmentStatus}
                </span>
              </div>

              {/* Course Details */}
              <div className="space-y-2 text-sm text-gray-600">
                <p className="line-clamp-2">{course.description}</p>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span>{course.schedule}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span>{course.location}</span>
                </div>
              </div>

              {/* Prerequisites */}
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Prerequisites:</h3>
                <div className="flex flex-wrap gap-2">
                  {course.prerequisites.map((prereq, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                      {prereq}
                    </span>
                  ))}
                </div>
              </div>

              {/* View Details Button */}
              <div className="mt-6">
                <Link
                  to={`/course/${course.id}`}
                  className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;