import React, { useEffect, useState, useContext } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AuthContext } from "@/contexts/AuthContext";
import { fetchCourses, fetchLessons, fetchTopics } from "../api/courseApi";
import { useNavigate } from "react-router-dom";

const Courses = () => {
  const { token } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [coursesData, lessonsData, topicsData] = await Promise.all([
          fetchCourses(token),
          fetchLessons(token),
          fetchTopics(token),
        ]);
        setCourses(coursesData);
        setLessons(lessonsData);
        setTopics(topicsData);
      } catch (err) {
        setError("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };
    if (token) loadData();
  }, [token]);

  // Helper to get lessons for a course
  const getLessons = (courseId) =>
    lessons.filter((l) => l.course_id === courseId);
  // Helper to get topics for a lesson
  const getTopics = (lessonId) => topics.filter((t) => t.lesson_id == lessonId);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Courses</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="flex flex-col cursor-pointer"
              onClick={() => {
                setSelectedCourse(course);
                setSelectedLesson(null);
              }}
            >
              <CardHeader>
                <CardTitle>{course.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2 text-sm text-muted-foreground">
                  {course.description}
                </p>
                <img
                  src={
                    course.image
                      ? `${import.meta.env.VITE_API_BASE_IMG_URL}uploads/${
                          course.image
                        }`
                      : "https://via.placeholder.com/150"
                  }
                  alt={course.name}
                  className="w-full h-32 object-cover rounded mb-2"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Lessons Modal */}
      <Dialog
        open={!!selectedCourse}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedCourse(null);
            setSelectedLesson(null);
          }
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedCourse?.name} Lessons</DialogTitle>
          </DialogHeader>
          {!selectedLesson ? (
            <div>
              {getLessons(selectedCourse?.id).length === 0 ? (
                <p>No lessons found.</p>
              ) : (
                getLessons(selectedCourse?.id).map((lesson) => (
                  <Card
                    key={lesson.id}
                    className="mb-2 cursor-pointer"
                    onClick={() => setSelectedLesson(lesson)}
                  >
                    <CardHeader>
                      <CardTitle className="text-base">{lesson.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-muted-foreground mb-1">
                        {lesson.description}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          ) : (
            <div>
              <Button
                variant="outline"
                size="sm"
                className="mb-2"
                onClick={() => setSelectedLesson(null)}
              >
                ← Back to Lessons
              </Button>
              <h3 className="font-semibold mb-2">
                Topics in {selectedLesson.name}
              </h3>
              {getTopics(selectedLesson.id).length === 0 ? (
                <p>No topics found.</p>
              ) : (
                getTopics(selectedLesson.id).map((topic) => (
                  <Card
                    key={topic.id}
                    className="mb-2 cursor-pointer"
                    onClick={() => navigate(`/learn/${topic.id}`)}
                  >
                    <CardHeader>
                      <CardTitle className="text-base">
                        {topic.title || "Untitled Topic"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-muted-foreground mb-1">
                        Lesson: {selectedLesson.name}
                      </div>
                      {topic.ppt && (
                        <span className="text-blue-600 underline text-xs">
                          View PPT
                        </span>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Courses;
