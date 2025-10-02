"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Mail,
  Phone,
  MapPin,
  Award,
  Save,
  Edit,
  ArrowLeft,
  Home,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Dr. Sarah Smith",
    email: "sarah.smith@clinic.com",
    phone: "+1 (555) 123-4567",
    license: "PSY-12345",
    specialization: "Clinical Psychology",
    location: "New York, NY",
    bio: "Licensed clinical psychologist with over 10 years of experience in cognitive behavioral therapy and psychological assessment. Specialized in anxiety disorders, depression, and trauma-informed care.",
    education: "Ph.D. in Clinical Psychology, Columbia University",
    certifications: ["CBT Certified", "Trauma-Informed Care", "EMDR Level 2"],
  });

  const handleSave = () => {
    setIsEditing(false);
    // Add save logic here
    console.log("Profile saved:", profile);
  };

  return (
    <div className="min-h-screen bg-background ">
      <div className="px-8 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => router.back()}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>

              <div>
                <h1 className="text-2xl font-bold text-foreground">Profile</h1>
                <p className="text-muted-foreground">
                  Manage your professional information
                </p>
              </div>
            </div>
            <Button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Overview */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage
                      src="/professional-doctor-avatar.png"
                      alt={profile.name}
                    />
                    <AvatarFallback className="text-2xl">DS</AvatarFallback>
                  </Avatar>
                  <CardTitle>{profile.name}</CardTitle>
                  <CardDescription>{profile.specialization}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{profile.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{profile.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="w-4 h-4 text-muted-foreground" />
                    <span>License: {profile.license}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Certifications */}
              <Card className="mt-4 h-37">
                <CardHeader className="p-0 pl-4">
                  <CardTitle className="text-lg">Certifications</CardTitle>
                </CardHeader>
                <CardContent className="p-0 pl-4 ">
                  <div className="flex flex-wrap gap-1">
                    {profile.certifications.map((cert, index) => (
                      <Badge key={index} variant="secondary">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Professional Information</CardTitle>
                  <CardDescription>
                    Your professional details and credentials
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) =>
                          setProfile({ ...profile, name: e.target.value })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) =>
                          setProfile({ ...profile, email: e.target.value })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) =>
                          setProfile({ ...profile, phone: e.target.value })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="license">License Number</Label>
                      <Input
                        id="license"
                        value={profile.license}
                        onChange={(e) =>
                          setProfile({ ...profile, license: e.target.value })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialization">Specialization</Label>
                      <Input
                        id="specialization"
                        value={profile.specialization}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            specialization: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={profile.location}
                        onChange={(e) =>
                          setProfile({ ...profile, location: e.target.value })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="education">Education</Label>
                    <Input
                      id="education"
                      value={profile.education}
                      onChange={(e) =>
                        setProfile({ ...profile, education: e.target.value })
                      }
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Professional Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) =>
                        setProfile({ ...profile, bio: e.target.value })
                      }
                      disabled={!isEditing}
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Statistics */}
              <Card className="mt-4 w-[154%] relative right-78">
                <CardHeader>
                  <CardTitle>Professional Statistics</CardTitle>
                  <CardDescription>
                    Your assessment and client metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">247</div>
                      <div className="text-sm text-muted-foreground">
                        Total Assessments
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">89</div>
                      <div className="text-sm text-muted-foreground">
                        Active Clients
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">94%</div>
                      <div className="text-sm text-muted-foreground">
                        Completion Rate
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">3.2</div>
                      <div className="text-sm text-muted-foreground">
                        Years Active
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
