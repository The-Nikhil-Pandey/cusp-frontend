import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext";
import { fetchTopics } from "../api/courseApi";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Learn = () => {
  const { topicId } = useParams();
  const { token } = useContext(AuthContext);
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTopic = async () => {
      setLoading(true);
      try {
        const topics = await fetchTopics(token);
        const found = topics.find((t) => String(t.id) === String(topicId));
        setTopic(found);
      } catch (err) {
        setError("Failed to load topic");
      } finally {
        setLoading(false);
      }
    };
    if (token && topicId) loadTopic();
  }, [token, topicId]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : topic ? (
        <Card>
          <CardHeader>
            <CardTitle>{topic.title || "Untitled Topic"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2 text-sm text-muted-foreground">
              Lesson: {topic.lesson_name}
            </p>
            <iframe
              src={`https://docs.google.com/gview?url=${encodeURIComponent(
                topic.ppt
              )}&embedded=true`}
              title="PPT Viewer"
              width="100%"
              height="600px"
              style={{ border: "1px solid #ccc", borderRadius: "8px" }}
              allowFullScreen
            />
          </CardContent>
        </Card>
      ) : (
        <p>Topic not found.</p>
      )}
    </div>
  );
};

export default Learn;
