import React, { useEffect, useState } from "react";
import { fetchTags, Tag } from "@/api/tags";
import { fetchAllUsers, fetchUserById } from "@/api/userApi";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Users, MapPin, Mail, MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Members = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [members, setMembers] = useState<any[]>([]);
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loadingTags, setLoadingTags] = useState(true);
  const [errorTags, setErrorTags] = useState<string | null>(null);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [errorMembers, setErrorMembers] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const getTags = async () => {
      setLoadingTags(true);
      setErrorTags(null);
      try {
        const data = await fetchTags();
        setTags(data);
      } catch (err) {
        setErrorTags("Failed to load tags");
      } finally {
        setLoadingTags(false);
      }
    };
    getTags();
  }, []);

  useEffect(() => {
    const getMembers = async () => {
      setLoadingMembers(true);
      setErrorMembers(null);
      try {
        const data = await fetchAllUsers();
        setMembers(data);
      } catch (err) {
        setErrorMembers("Failed to load members");
      } finally {
        setLoadingMembers(false);
      }
    };
    getMembers();
  }, []);

  const handleCardClick = async (member: any) => {
    setModalLoading(true);
    try {
      const detail = await fetchUserById(member.id);
      setSelectedMember(detail);
    } catch (err) {
      toast({ title: "Failed to load user details", variant: "destructive" });
    } finally {
      setModalLoading(false);
    }
  };

  const filteredMembers = members.filter((member) => {
    const name = member.username || "";
    const email = member.email || "";
    const location = member.address || "";
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Users className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Members</h1>
        </div>
        <p className="text-muted-foreground mb-4">
          Connect with {members.length} social care professionals in our
          community
        </p>
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      {/* Members Grid */}
      {loadingMembers ? (
        <div className="text-center py-12">Loading members...</div>
      ) : errorMembers ? (
        <div className="text-center text-red-500 py-12">{errorMembers}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <Card
              key={member.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleCardClick(member)}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={member.profile_photo || "/placeholder.svg"}
                    />
                    <AvatarFallback className="text-lg">
                      {(member.username || "?").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">
                      {member.username}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {member.email}
                    </p>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{member.address || "-"}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {(member.tag_details || [])
                    .slice(0, 2)
                    .map((tag: any, idx: number) => (
                      <Badge
                        key={tag.id}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  {member.tag_details && member.tag_details.length > 6 && (
                    <span className="text-xs text-muted-foreground">
                      +{member.tag_details.length - 6} more
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {filteredMembers.length === 0 && !loadingMembers && !errorMembers && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            No members found matching your search.
          </p>
        </div>
      )}
      {/* Member Details Modal */}
      <Dialog
        open={!!selectedMember}
        onOpenChange={() => setSelectedMember(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Member Profile</DialogTitle>
          </DialogHeader>
          {modalLoading ? (
            <div className="py-8 text-center">Loading...</div>
          ) : (
            selectedMember && (
              <div className="space-y-6">
                <div className="flex items-center justify-between space-x-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage
                        src={selectedMember.profile_photo || "/placeholder.svg"}
                      />
                      <AvatarFallback className="text-2xl">
                        {(selectedMember.username || "?").charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold">
                        {selectedMember.username}
                      </h3>
                      <p className="text-muted-foreground">
                        {selectedMember.email}
                      </p>
                      <div className="flex items-center space-x-1 text-muted-foreground mt-1">
                        <MapPin className="h-4 w-4" />
                        <span>{selectedMember.address || "-"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    {(!user ||
                      String(user.id) !== String(selectedMember.id)) && (
                      <button
                        className="flex items-center gap-1 text-primary hover:text-primary/80 focus:outline-none"
                        onClick={() =>
                          toast({
                            title: `Message to ${selectedMember.username}`,
                          })
                        }
                      >
                        <MessageCircle className="h-6 w-6" />
                        <span className="text-xs font-medium">Message</span>
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {(selectedMember.tag_details || []).map((tag: any) => (
                      <Badge key={tag.id} variant="secondary">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Member Since</h4>
                  <p className="text-muted-foreground">
                    {selectedMember.created_at
                      ? new Date(selectedMember.created_at).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "long", day: "numeric" }
                        )
                      : "-"}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Job Title</h4>
                  <p className="text-muted-foreground">
                    {selectedMember.job_title || "-"}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Company</h4>
                  <p className="text-muted-foreground">
                    {selectedMember.company_name || "-"}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Language</h4>
                  <p className="text-muted-foreground">
                    {selectedMember.language || "-"}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Headline</h4>
                  <p className="text-muted-foreground">
                    {selectedMember.headline || "-"}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Phone</h4>
                  <p className="text-muted-foreground">
                    {selectedMember.phone || "-"}
                  </p>
                </div>
              </div>
            )
          )}
        </DialogContent>
      </Dialog>
      {/* All Tags Section */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">All Tags</h2>
        {loadingTags && <span>Loading tags...</span>}
        {errorTags && <span className="text-red-500">{errorTags}</span>}
        {!loadingTags && !errorTags && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag.id} variant="secondary">
                {tag.name}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Members;
