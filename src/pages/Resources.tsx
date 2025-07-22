import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  fetchDocuments,
  fetchDocumentById,
  addDocument,
  // editDocument,
  deleteDocument,
} from "@/api/documents";
// import axios from "axios";
import { useNavigate } from "react-router-dom";

const getToken = () => localStorage.getItem("cusp-token") || "";
const getUserId = () => {
  const user = localStorage.getItem("cusp-user");
  return user ? JSON.parse(user).id : "";
};

const fileTypeIcon = (type: string) => {
  if (type.startsWith("image")) return <span>🖼️</span>;
  if (type.startsWith("video")) return <span>🎬</span>;
  if (type === "application/pdf") return <span>📄</span>;
  if (type.includes("presentation")) return <span>📊</span>;
  return <span>📁</span>;
};

const BASE_UPLOAD_URL = "http://31.97.56.234:8000/uploads/";
// const BASE_API_URL = "http://31.97.56.234:8000/api/documents/";

const Resources = () => {
  // Edit modal state
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  // Confirmation dialog state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteDocId, setDeleteDocId] = useState(null);
  // If you have a theme context, use it for styling
  // const { theme } = useTheme();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterTitle, setFilterTitle] = useState("");
  const [byMe, setByMe] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editDoc, setEditDoc] = useState(null);
  const [viewDoc, setViewDoc] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState("");
  const [addTitle, setAddTitle] = useState("");
  const [addDesc, setAddDesc] = useState("");
  const [addFiles, setAddFiles] = useState([]);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");
  const userId = getUserId();
  const token = getToken();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const docs = await fetchDocuments(token);
        setDocuments(docs);
      } catch (e) {
        setError("Failed to load resources");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const filtered = documents.filter((doc) => {
    if (byMe && String(doc.user_id) !== String(userId)) return false;
    if (filterTitle) {
      const search = filterTitle.toLowerCase();
      const titleMatch = doc.title?.toLowerCase().includes(search);
      const usernameMatch = doc.username?.toLowerCase().includes(search);
      if (!titleMatch && !usernameMatch) return false;
    }
    return true;
  });

  // Fetch document details for view modal
  const handleView = async (id) => {
    setViewLoading(true);
    setViewError("");
    try {
      const doc = await fetchDocumentById(id, token);
      setViewDoc(doc);
    } catch (e) {
      setViewError("Failed to load resource details");
    } finally {
      setViewLoading(false);
    }
  };

  // Handle add or edit resource
  const handleAddResource = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError("");
    try {
      const formData = new FormData();
      formData.append("title", addTitle);
      formData.append("description", addDesc);
      for (let i = 0; i < addFiles.length; i++) {
        formData.append("documents", addFiles[i]);
      }
      if (isEditMode && editDoc) {
        // Edit mode
        await import("@/api/documents").then(({ editDocument }) =>
          editDocument(editDoc.id, formData, token)
        );
      } else {
        // Add mode
        await addDocument(formData, token);
      }
      setShowAddModal(false);
      setAddTitle("");
      setAddDesc("");
      setAddFiles([]);
      setEditDoc(null);
      setIsEditMode(false);
      // Refresh list
      const docs = await fetchDocuments(token);
      setDocuments(docs);
    } catch (err) {
      setAddError(
        isEditMode ? "Failed to update resource" : "Failed to add resource"
      );
    } finally {
      setAddLoading(false);
    }
  };

  // Full screen preview
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewType, setPreviewType] = useState("");

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4">
      <div className="flex flex-row md:items-center gap-4 mb-6">
        <Input
          placeholder="Filter by Title or Name"
          value={filterTitle}
          onChange={(e) => setFilterTitle(e.target.value)}
          className="sm:max-w-xs max-w-[185px]"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={byMe}
            onChange={(e) => setByMe(e.target.checked)}
          />
          <span>By Me</span>
        </label>
        <Button onClick={() => setShowAddModal(true)} className="ml-auto">
          Add Resource
        </Button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((doc) => (
            <Card key={doc.id} className="relative">
              <CardHeader className="flex items-center gap-2">
                {fileTypeIcon(doc.file_type)}
                <CardTitle>{doc.title}</CardTitle>
                <CardDescription>{doc.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div>
                    <span className="font-semibold">Uploaded By:</span>{" "}
                    {doc.username || "Unknown"}
                  </div>
                  <div>
                    <span className="font-semibold">Date:</span>{" "}
                    {new Date(doc.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleView(doc.id)}
                  >
                    View
                  </Button>
                  {String(doc.user_id) === String(userId) && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          setEditLoading(true);
                          setEditError("");
                          setIsEditMode(true);
                          setShowAddModal(true);
                          try {
                            const docDetail = await fetchDocumentById(
                              doc.id,
                              token
                            );
                            setEditDoc(docDetail);
                            setAddTitle(docDetail.title || "");
                            setAddDesc(docDetail.description || "");
                            setAddFiles([]); // Don't prefill files, let user upload new ones
                          } catch (e) {
                            setEditError("Failed to fetch document details");
                          } finally {
                            setEditLoading(false);
                          }
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setDeleteDocId(doc.id);
                          setDeleteConfirmOpen(true);
                        }}
                      >
                        Delete
                      </Button>
                      {/* Delete Confirmation Dialog */}
                      {deleteConfirmOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-sm w-full p-6 border border-border relative animate-fade-in">
                            <h2 className="text-xl font-semibold mb-2 text-center text-foreground">
                              Delete Resource
                            </h2>
                            <p className="text-center text-muted-foreground mb-4">
                              Are you sure you want to delete this resource?
                              This action cannot be undone.
                            </p>
                            <div className="flex gap-4 justify-center mt-4">
                              <button
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                                onClick={async () => {
                                  if (!deleteDocId) return;
                                  setLoading(true);
                                  try {
                                    await deleteDocument(deleteDocId, token);
                                    setDocuments((docs) =>
                                      docs.filter(
                                        (doc) => doc.id !== deleteDocId
                                      )
                                    );
                                    setDeleteConfirmOpen(false);
                                    setDeleteDocId(null);
                                  } catch (e) {
                                    setError("Failed to delete document.");
                                  } finally {
                                    setLoading(false);
                                  }
                                }}
                              >
                                Delete
                              </button>
                              <button
                                className="bg-gray-200 dark:bg-gray-700 text-foreground px-4 py-2 rounded"
                                onClick={() => {
                                  setDeleteConfirmOpen(false);
                                  setDeleteDocId(null);
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {/* View Modal */}
      {viewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-xl"
              onClick={() => setViewDoc(null)}
            >
              &times;
            </button>
            {viewLoading ? (
              <div>Loading...</div>
            ) : viewError ? (
              <div className="text-red-500">{viewError}</div>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-2">{viewDoc.title}</h2>
                <p className="mb-2 text-muted-foreground">
                  {viewDoc.description}
                </p>
                <div className="mb-2">
                  <span className="font-semibold">Uploaded By:</span>{" "}
                  {viewDoc.username}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(viewDoc.created_at).toLocaleString()}
                </div>
                <div className="mb-4">
                  <span className="font-semibold">Type:</span>{" "}
                  {viewDoc.file_type}
                </div>
                {/* File Preview */}
                {viewDoc.file_type.startsWith("image") ? (
                  <img
                    src={BASE_UPLOAD_URL + viewDoc.file_path}
                    alt={viewDoc.title}
                    className="max-h-64 w-auto mx-auto cursor-pointer"
                    onClick={() => {
                      setPreviewUrl(BASE_UPLOAD_URL + viewDoc.file_path);
                      setPreviewType("image");
                    }}
                  />
                ) : viewDoc.file_type === "application/pdf" ? (
                  <iframe
                    src={BASE_UPLOAD_URL + viewDoc.file_path}
                    title={viewDoc.title}
                    className="w-full h-64 border rounded cursor-pointer"
                    onClick={() => {
                      setPreviewUrl(BASE_UPLOAD_URL + viewDoc.file_path);
                      setPreviewType("pdf");
                    }}
                  />
                ) : viewDoc.file_type.startsWith("video") ? (
                  <video
                    src={BASE_UPLOAD_URL + viewDoc.file_path}
                    controls
                    className="w-full max-h-64 mx-auto cursor-pointer"
                    onClick={() => {
                      setPreviewUrl(BASE_UPLOAD_URL + viewDoc.file_path);
                      setPreviewType("video");
                    }}
                  />
                ) : (
                  <a
                    href={BASE_UPLOAD_URL + viewDoc.file_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Download File
                  </a>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Add/Edit Resource Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <form
            className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative"
            onSubmit={handleAddResource}
          >
            <button
              type="button"
              className="absolute top-2 right-2 text-xl"
              onClick={() => {
                setShowAddModal(false);
                setAddTitle("");
                setAddDesc("");
                setAddFiles([]);
                setEditDoc(null);
                setIsEditMode(false);
              }}
            >
              &times;
            </button>
            <h2 className="text-lg font-bold mb-4">
              {isEditMode ? "Edit Resource" : "Add Resource"}
            </h2>
            {(addError || editError) && (
              <div className="text-red-500 mb-2">{addError || editError}</div>
            )}
            <div className="mb-3">
              <label className="block font-semibold mb-1">Title</label>
              <input
                type="text"
                className="w-full border rounded px-2 py-1"
                value={addTitle}
                onChange={(e) => setAddTitle(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="block font-semibold mb-1">Description</label>
              <textarea
                className="w-full border rounded px-2 py-1"
                value={addDesc}
                onChange={(e) => setAddDesc(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="block font-semibold mb-1">Documents</label>
              <input
                type="file"
                multiple
                accept="image/*,video/*,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                onChange={(e) => setAddFiles(Array.from(e.target.files))}
                // Only required in add mode
                required={!isEditMode}
              />
              {isEditMode && editDoc && (
                <div className="text-xs text-muted-foreground mt-2">
                  Current file: {editDoc.file_path}
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-4">
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded"
                disabled={addLoading || editLoading}
              >
                {addLoading || editLoading
                  ? isEditMode
                    ? "Updating..."
                    : "Saving..."
                  : isEditMode
                  ? "Update"
                  : "Save"}
              </button>
              <button
                type="button"
                className="bg-gray-200 px-4 py-2 rounded"
                onClick={() => {
                  setShowAddModal(false);
                  setAddTitle("");
                  setAddDesc("");
                  setAddFiles([]);
                  setEditDoc(null);
                  setIsEditMode(false);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Full Screen Preview */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
          onClick={() => setPreviewUrl("")}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <button
              className="absolute top-4 right-8 text-white text-3xl"
              onClick={() => setPreviewUrl("")}
            >
              ×
            </button>
            {previewType === "image" ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-[90vh] max-w-[90vw] mx-auto"
              />
            ) : previewType === "pdf" ? (
              <iframe
                src={previewUrl}
                title="Preview"
                className="w-[90vw] h-[90vh] bg-white"
              />
            ) : previewType === "video" ? (
              <video
                src={previewUrl}
                controls
                className="max-h-[90vh] max-w-[90vw] mx-auto"
              />
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default Resources;
