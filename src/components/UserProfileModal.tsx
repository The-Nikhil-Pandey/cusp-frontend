import React, { useEffect, useState } from "react";
import { MoreVertical } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { fetchTags, Tag } from "@/api/tags";
import { CreatePostForm } from "./CreatePostForm";
import {
  fetchPosts,
  Post,
  deletePost,
  updatePost,
  fetchPostById,
} from "@/api/post";

interface UserProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const UserProfileModal: React.FC<UserProfileModalProps> = ({
  open,
  onOpenChange,
}) => {
  const { user } = useAuth();
  const [tags, setTags] = useState<Tag[]>([]);
  const [loadingTags, setLoadingTags] = useState(true);
  const [errorTags, setErrorTags] = useState<string | null>(null);
  const [apiUser, setApiUser] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<"profile" | "posts">("profile");
  // Media modal states at component level
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [activeMediaList, setActiveMediaList] = useState<string[]>([]);
  const [mediaIndex, setMediaIndex] = useState(0);

  // More menu and edit/delete states
  const [moreMenuOpenId, setMoreMenuOpenId] = useState<number | null>(null);
  const [deleteDialogOpenId, setDeleteDialogOpenId] = useState<number | null>(
    null
  );
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editPostData, setEditPostData] = useState<Post | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  // Function to open media modal with a media list and index
  const openMediaModal = (mediaList: string[], index: number) => {
    setActiveMediaList(mediaList);
    setMediaIndex(index);
    setMediaModalOpen(true);
  };
  const closeMediaModal = () => setMediaModalOpen(false);
  const prevMedia = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setMediaIndex((prev) =>
      activeMediaList.length > 0
        ? prev === 0
          ? activeMediaList.length - 1
          : prev - 1
        : prev
    );
  };
  const nextMedia = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setMediaIndex((prev) =>
      activeMediaList.length > 0
        ? prev === activeMediaList.length - 1
          ? 0
          : prev + 1
        : prev
    );
  };

  useEffect(() => {
    setLoadingTags(true);
    setErrorTags(null);
    fetchTags()
      .then((data) => setTags(data))
      .catch(() => setErrorTags("Failed to load tags"))
      .finally(() => setLoadingTags(false));
    fetchPosts().then(setPosts);
    // Fetch user details from API using axios
    import("axios").then((axios) => {
      axios.default
        .get(`${API_BASE_URL}/users/${user?.id}`)
        .then((res) => setApiUser(res.data))
        .catch((err) => console.error("Failed to fetch user details:", err));
    });
  }, [user?.id]);

  console.log("user", user, apiUser);

  if (!user || !apiUser) return null;

  // Helper to parse tag_id from API (stringified array)
  const parseApiTagIds = (tagId: any) => {
    if (Array.isArray(tagId)) return tagId;
    if (typeof tagId === "string") {
      try {
        return JSON.parse(tagId);
      } catch {
        return [];
      }
    }
    return [];
  };

  // Compare and update user details if different from API
  const mergedUser = {
    ...user,
    fullName:
      apiUser.username !== user.fullName ? apiUser.username : user.fullName,
    email: apiUser.email !== user.email ? apiUser.email : user.email,
    phone: apiUser.phone !== user.phone ? apiUser.phone : user.phone,
    address: apiUser.address !== user.address ? apiUser.address : user.address,
    jobTitle:
      apiUser.job_title !== user.jobTitle ? apiUser.job_title : user.jobTitle,
    company:
      apiUser.company_name !== user.company
        ? apiUser.company_name
        : user.company,
    profileImage:
      apiUser.profile_photo !== user.profileImage
        ? apiUser.profile_photo
        : user.profileImage,
    headline:
      apiUser.headline !== user.headline ? apiUser.headline : user.headline,
    language:
      apiUser.language !== user.language ? apiUser.language : user.language,
    timezone:
      apiUser.timezone !== user.timezone ? apiUser.timezone : user.timezone,
    tag_id:
      JSON.stringify(apiUser.tag_id) !== JSON.stringify(user.tag_id)
        ? parseApiTagIds(apiUser.tag_id)
        : user.tag_id,
    que1: apiUser.que1 !== user.que1 ? apiUser.que1 : user.que1,
    que2: apiUser.que2 !== user.que2 ? apiUser.que2 : user.que2,
    joinedDate:
      apiUser.created_at !== user.joinedDate
        ? apiUser.created_at
        : user.joinedDate,
  };

  const tagIds: number[] = Array.isArray(mergedUser.tag_id)
    ? mergedUser.tag_id
    : [];
  const tagNames = tagIds
    .map((id) => tags.find((t) => t.id === id)?.name)
    .filter(Boolean);

  console.log("user", mergedUser);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl max-h-[80vh] overflow-y-auto"
        style={{
          overflowY: "scroll",
          scrollbarWidth: "thin",

          WebkitOverflowScrolling: "touch",
          scrollbarColor: "transparent transparent",
        }}
      >
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
        </DialogHeader>
        {/* Tabs */}
        <div className="flex border-b mb-4">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "profile"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "posts"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("posts")}
          >
            Posts
          </button>
        </div>
        {/* Tab Content */}
        {activeTab === "profile" ? (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={mergedUser.profileImage} />
                <AvatarFallback className="text-2xl">
                  {mergedUser.fullName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{mergedUser.fullName}</h3>
                <p className="text-muted-foreground">{mergedUser.email}</p>
                <p className="text-sm text-muted-foreground">
                  Joined {new Date(mergedUser.joinedDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Job Title</h4>
                <p className="text-muted-foreground">
                  {mergedUser.jobTitle || "Not specified"}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Company</h4>
                <p className="text-muted-foreground">
                  {mergedUser.company || "Not specified"}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Timezone</h4>
                <p className="text-muted-foreground">
                  {mergedUser.timezone || "Not specified"}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Language</h4>
                <p className="text-muted-foreground">
                  {mergedUser.language || "Not specified"}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Social Care Work</h4>
              <div className="flex flex-wrap gap-2">
                {tagNames.length > 0 ? (
                  tagNames.map((name) => (
                    <Badge key={name} variant="secondary">
                      {name}
                    </Badge>
                  ))
                ) : (
                  <p className="text-muted-foreground">Not specified</p>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Headline</h4>
              <p className="text-muted-foreground">
                {mergedUser.headline || "Not specified"}
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Phone</h4>
              <p className="text-muted-foreground">
                {mergedUser.phone || "Not specified"}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">
                Are you planning to open a squat practice?
              </h4>
              <p className="text-muted-foreground">
                {mergedUser.que1
                  ? mergedUser.que1.charAt(0).toUpperCase() +
                    mergedUser.que1.slice(1)
                  : "Not specified"}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Are you a supplier?</h4>
              <p className="text-muted-foreground">
                {mergedUser.que2
                  ? mergedUser.que2.charAt(0).toUpperCase() +
                    mergedUser.que2.slice(1)
                  : "Not specified"}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Address</h4>
              <p className="text-muted-foreground">
                {mergedUser.address || "Not specified"}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* User's Posts */}
            <h3 className="text-xl font-semibold mb-4">Your Posts</h3>
            {posts.filter((p) => p.user_id === String(user.id)).length === 0 ? (
              <p className="text-muted-foreground">No posts found.</p>
            ) : (
              posts
                .filter((p) => p.user_id === String(user.id))
                .map((post) => {
                  // Collect all media URLs from uploads
                  const media = (post.uploads || [])
                    .map((u) =>
                      u.image
                        ? API_BASE_URL.replace("/api", "") + u.image
                        : u.video
                        ? API_BASE_URL.replace("/api", "") + u.video
                        : null
                    )
                    .filter(Boolean);

                  return (
                    <div
                      key={post.id}
                      className="border rounded-lg p-4 mb-4 bg-background relative"
                    >
                      {/* More menu (3 dots) */}
                      <div className="absolute top-2 right-2 z-10">
                        <button
                          className="p-2 rounded-full hover:bg-primary"
                          onClick={() =>
                            setMoreMenuOpenId(
                              moreMenuOpenId === post.id ? null : post.id
                            )
                          }
                        >
                          <MoreVertical size={20} />
                        </button>
                        {moreMenuOpenId === post.id && (
                          <div className="absolute right-0 mt-2 w-32 bg-popover border border-border rounded shadow-lg z-20">
                            <button
                              className="w-full text-left px-4 py-2 hover:bg-accent"
                              onClick={async () => {
                                setEditLoading(true);
                                try {
                                  const token =
                                    localStorage.getItem("cusp-token");
                                  const data = await fetchPostById(
                                    String(post.id),
                                    token
                                  );
                                  setEditPostData(data);
                                  console.log("editPostData", data);

                                  setEditModalOpen(true);
                                  setMoreMenuOpenId(null);
                                } finally {
                                  setEditLoading(false);
                                }
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="w-full text-left px-4 py-2 hover:bg-accent text-destructive"
                              onClick={() => {
                                setDeleteDialogOpenId(post.id);
                                setMoreMenuOpenId(null);
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                      <h4 className="text-lg font-bold mb-1">{post.title}</h4>
                      <p className="mb-2 whitespace-pre-line">
                        {post.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {post.tags && post.tags.length > 0
                          ? post.tags.map((tag) => (
                              <Badge key={tag.tag_id} variant="secondary">
                                {tag.tag_title}
                              </Badge>
                            ))
                          : null}
                      </div>
                      {/* Media Collage */}
                      {media.length > 0 && (
                        <div className="w-full mb-2">
                          <div className="grid grid-cols-3 gap-1 rounded-lg overflow-hidden max-h-52 sm:min-h-[120px]">
                            {media.slice(0, 3).map((url, idx) => (
                              <div
                                key={url}
                                className={`relative cursor-pointer group aspect-square bg-muted flex items-center justify-center ${
                                  idx === 2 && media.length > 3
                                    ? "col-span-1"
                                    : ""
                                }`}
                                onClick={() => openMediaModal(media, idx)}
                              >
                                {url.match(/\.(mp4|webm|ogg)$/i) ? (
                                  <video
                                    src={url}
                                    className="object-cover w-full h-full"
                                    muted
                                    playsInline
                                    preload="metadata"
                                  />
                                ) : (
                                  <img
                                    src={url}
                                    alt="Post media"
                                    className="object-cover w-full h-full"
                                  />
                                )}
                                {/* Video play icon overlay */}
                                {url.match(/\.(mp4|webm|ogg)$/i) && (
                                  <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <svg
                                      width="40"
                                      height="40"
                                      viewBox="0 0 40 40"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <circle
                                        cx="20"
                                        cy="20"
                                        r="20"
                                        fill="rgba(0,0,0,0.5)"
                                      />
                                      <polygon
                                        points="16,13 28,20 16,27"
                                        fill="#fff"
                                      />
                                    </svg>
                                  </span>
                                )}
                                {/* Overlay for +N more */}
                                {idx === 2 && media.length > 3 && (
                                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                    <span className="text-white text-lg font-semibold">
                                      +{media.length - 3}
                                    </span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>Likes: {post.likes}</span>
                        <span>Comments: {post.comments}</span>
                      </div>
                      {/* Delete Confirmation Dialog */}
                      {deleteDialogOpenId === post.id && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                          <div className="bg-background rounded-lg shadow-lg p-6 w-[350px] max-w-full">
                            <h3 className="text-lg font-bold mb-2 text-destructive">
                              Delete Post?
                            </h3>
                            <p className="mb-4 text-muted-foreground">
                              Are you sure you want to delete this post? This
                              action cannot be undone.
                            </p>
                            <div className="flex justify-end gap-2">
                              <button
                                className="px-4 py-2 rounded bg-muted text-foreground"
                                onClick={() => setDeleteDialogOpenId(null)}
                              >
                                Cancel
                              </button>
                              <button
                                className="px-4 py-2 rounded bg-destructive text-white"
                                onClick={async () => {
                                  const token =
                                    localStorage.getItem("cusp-token");
                                  try {
                                    await deletePost(String(post.id), token);
                                    setPosts((prev) =>
                                      prev.filter((p) => p.id !== post.id)
                                    );
                                    setDeleteDialogOpenId(null);
                                  } catch (err) {
                                    alert("Failed to delete post.");
                                  }
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
            )}
          </div>
        )}
        {/* Single Media Modal rendered outside .map() */}
        {mediaModalOpen && activeMediaList.length > 0 && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            onClick={closeMediaModal}
          >
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2"
              onClick={prevMedia}
            >
              &#8592;
            </button>
            <div className="max-w-full max-h-full flex items-center justify-center">
              {activeMediaList[mediaIndex].match(/\.(mp4|webm|ogg)$/i) ? (
                <video
                  src={activeMediaList[mediaIndex]}
                  className="max-h-[80vh] max-w-[90vw] rounded-lg"
                  controls
                  autoPlay
                />
              ) : (
                <img
                  src={activeMediaList[mediaIndex]}
                  alt="Post media"
                  className="max-h-[80vh] max-w-[90vw] rounded-lg"
                />
              )}
            </div>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2"
              onClick={nextMedia}
            >
              &#8594;
            </button>
            <button
              className="absolute top-4 right-4 text-white text-2xl"
              onClick={closeMediaModal}
            >
              &times;
            </button>
          </div>
        )}
        {/* Edit Modal/Drawer (reuse post creation form) */}
        {editModalOpen && editPostData && (
          <Dialog open={true} onOpenChange={setEditModalOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Post</DialogTitle>
              </DialogHeader>
              {loadingTags ? (
                <div className="p-4">Loading tags...</div>
              ) : errorTags ? (
                <div className="p-4 text-red-500">{errorTags}</div>
              ) : (
                <CreatePostForm
                  tags={tags}
                  initialValues={{
                    title: editPostData.title,
                    description: editPostData.description,
                    selectedTags: editPostData.tags?.map((t) => t.tag_id) || [],
                    images: (editPostData.uploads || [])
                      .filter((u) => u.image)
                      .map((u) => API_BASE_URL.replace("/api", "") + u.image),
                    videos: (editPostData.uploads || [])
                      .filter((u) => u.video)
                      .map((u) => API_BASE_URL.replace("/api", "") + u.video),
                    uploads: (editPostData.uploads || []).map((u) => ({
                      id: u.id,
                      image: u.image
                        ? API_BASE_URL.replace("/api", "") + u.image
                        : null,
                      video: u.video
                        ? API_BASE_URL.replace("/api", "") + u.video
                        : null,
                    })),
                  }}
                  editMode={true}
                  postId={editPostData.id}
                  onSuccess={() => {
                    setEditModalOpen(false);
                    // Optionally, refetch posts or update UI
                  }}
                />
              )}
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileModal;
