import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { submitCalculatorForm } from "@/api/calculator";
import {
  Building2,
  Calculator,
  Mail,
  Phone,
  User,
  MapPin,
  Wrench,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

const Calc = () => {
  const [formData, setFormData] = useState({
    // Contact Details
    name: "",
    email: "",
    phone: "",

    // Practice Details
    siteSize: "",
    dentalChairs: "",
    practiceType: "",
    interiorFinish: "",

    // Location Details
    locationType: "",
    locationOther: "",
    unitCondition: "",

    // Equipment
    equipmentCondition: "",
    equipmentNeeded: [],
    specialistEquipment: [],
  });

  const [submitted, setSubmitted] = useState(false);
  const { token } = useAuth();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => {
      // Location logic
      if (field === "locationType") {
        return {
          ...prev,
          locationType: value,
          locationOther: value === "Other" ? prev.locationOther : "N/A",
        };
      }
      if (field === "locationOther") {
        return {
          ...prev,
          locationOther: value,
          locationType: value ? "N/A" : prev.locationType,
        };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleCheckboxChange = (
    field: string,
    value: string,
    checked: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked
        ? [...prev[field], value]
        : prev[field].filter((item) => item !== value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // All fields required check
    const requiredFields = [
      "name",
      "email",
      "phone",
      "siteSize",
      "dentalChairs",
      "practiceType",
      "interiorFinish",
      "locationType",
      "unitCondition",
      "equipmentCondition",
    ];
    for (const field of requiredFields) {
      if (
        !formData[field] ||
        (Array.isArray(formData[field]) && formData[field].length === 0)
      ) {
        toast({
          title: "Missing Field",
          description: `Please fill the required field: ${field}`,
          variant: "destructive",
        });
        return;
      }
    }
    // If locationType is Other, locationOther must be filled
    if (formData.locationType === "Other" && !formData.locationOther) {
      toast({
        title: "Missing Field",
        description: "Please specify your location type.",
        variant: "destructive",
      });
      return;
    }
    try {
      await submitCalculatorForm(formData, token || "");
      toast({
        title: "Submitted!",
        description: "Your calculator data has been sent successfully.",
      });
      setSubmitted(true);
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description:
          error?.message ||
          "Could not submit calculator data. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center shadow-2xl border-0">
          <CardContent className="pt-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Thank You!
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Thank you for completing this cost calculator for your dental
              practice. Your quotation will be sent to your email address within
              a few hours.
            </p>
            <Button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  name: "",
                  email: "",
                  phone: "",
                  siteSize: "",
                  dentalChairs: "",
                  practiceType: "",
                  interiorFinish: "",
                  locationType: "",
                  locationOther: "",
                  unitCondition: "",
                  equipmentCondition: "",
                  equipmentNeeded: [],
                  specialistEquipment: [],
                });
              }}
              className="mt-6 bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 transition-all duration-300"
            >
              Calculate Another Quote
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-orange-500 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Calculator className="w-16 h-16 mx-auto mb-4 animate-pulse" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            DreamSquat Practice Build Cost Calculator
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
            Get an instant estimate for building your dream dental practice
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="container mx-auto px-4 py-12">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
          {/* Contact Details */}
          <Card className="shadow-xl border-0 hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-orange-100 to-purple-100">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <User className="w-6 h-6 text-orange-600" />
                Contact Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="name" className="text-gray-700 font-medium">
                    Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="mt-1 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="mt-1 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-gray-700 font-medium">
                    Phone *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="mt-1 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* General Practice Details */}
          <Card className="shadow-xl border-0 hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-orange-100 to-purple-100">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Building2 className="w-6 h-6 text-purple-600" />
                General Practice Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-gray-700 font-medium mb-3 block">
                    Site Size *
                  </Label>
                  <RadioGroup
                    value={formData.siteSize}
                    onValueChange={(value) =>
                      handleInputChange("siteSize", value)
                    }
                  >
                    {[
                      "Under 1,000 sq ft",
                      "1,000–1,500 sq ft",
                      "1,500–2,000 sq ft",
                      "2,000–3,000 sq ft",
                      "Over 3,000 sq ft",
                    ].map((size) => (
                      <div key={size} className="flex items-center space-x-2">
                        <RadioGroupItem value={size} id={size} />
                        <Label htmlFor={size} className="cursor-pointer">
                          {size}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-gray-700 font-medium mb-3 block">
                    Number of Dental Chairs *
                  </Label>
                  <RadioGroup
                    value={formData.dentalChairs}
                    onValueChange={(value) =>
                      handleInputChange("dentalChairs", value)
                    }
                  >
                    {[
                      "1 Chair",
                      "2 Chairs",
                      "3 Chairs",
                      "4 Chairs",
                      "5+ Chairs",
                    ].map((chairs) => (
                      <div key={chairs} className="flex items-center space-x-2">
                        <RadioGroupItem value={chairs} id={chairs} />
                        <Label htmlFor={chairs} className="cursor-pointer">
                          {chairs}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-gray-700 font-medium mb-3 block">
                    Practice Type *
                  </Label>
                  <Select
                    value={formData.practiceType}
                    onValueChange={(value) =>
                      handleInputChange("practiceType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select practice type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NHS">NHS</SelectItem>
                      <SelectItem value="Private">Private</SelectItem>
                      <SelectItem value="Mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-gray-700 font-medium mb-3 block">
                    Interior Finish *
                  </Label>
                  <Select
                    value={formData.interiorFinish}
                    onValueChange={(value) =>
                      handleInputChange("interiorFinish", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select finish level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High-End Luxury">
                        High-End Luxury
                      </SelectItem>
                      <SelectItem value="Premium Mid-Level">
                        Premium Mid-Level
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Practice Location Details */}
          <Card className="shadow-xl border-0 hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-orange-100 to-purple-100">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <MapPin className="w-6 h-6 text-orange-600" />
                Practice Location Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <Label className="text-gray-700 font-medium mb-3 block">
                  Practice Location Type *
                </Label>
                <RadioGroup
                  value={formData.locationType}
                  onValueChange={(value) =>
                    handleInputChange("locationType", value)
                  }
                >
                  {[
                    "High Street",
                    "Shopping Center",
                    "Medical Center",
                    "Standalone Building",
                    "Residential Area",
                    "Other",
                  ].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <RadioGroupItem value={type} id={type} />
                      <Label htmlFor={type} className="cursor-pointer">
                        {type}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                {formData.locationType === "Other" && (
                  <div className="mt-3">
                    <Label
                      htmlFor="locationOther"
                      className="text-gray-700 font-medium"
                    >
                      Please specify:
                    </Label>
                    <Input
                      id="locationOther"
                      value={formData.locationOther}
                      onChange={(e) =>
                        handleInputChange("locationOther", e.target.value)
                      }
                      className="mt-1 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      placeholder="Describe your location type"
                    />
                  </div>
                )}
              </div>

              <div>
                <Label className="text-gray-700 font-medium mb-3 block">
                  Current Unit Condition *
                </Label>
                <Select
                  value={formData.unitCondition}
                  onValueChange={(value) =>
                    handleInputChange("unitCondition", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Vacant shell">Vacant shell</SelectItem>
                    <SelectItem value="Previously used">
                      Previously used
                    </SelectItem>
                    <SelectItem value="Requires renovation">
                      Requires renovation
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Equipment Choices */}
          <Card className="shadow-xl border-0 hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-orange-100 to-purple-100">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Wrench className="w-6 h-6 text-purple-600" />
                Equipment Choices
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <Label className="text-gray-700 font-medium mb-3 block">
                  Equipment Condition *
                </Label>
                <RadioGroup
                  value={formData.equipmentCondition}
                  onValueChange={(value) =>
                    handleInputChange("equipmentCondition", value)
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="All New" id="all-new" />
                    <Label htmlFor="all-new" className="cursor-pointer">
                      All New
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="Mostly Refurbished"
                      id="refurbished"
                    />
                    <Label htmlFor="refurbished" className="cursor-pointer">
                      Mostly Refurbished
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-gray-700 font-medium mb-3 block">
                  Equipment Needed
                </Label>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    "Dental Chair",
                    "X-ray Machine",
                    "Autoclave",
                    "Compressor",
                    "Suction Unit",
                    "Intraoral Camera",
                    "LED Curing Light",
                    "Ultrasonic Scaler",
                  ].map((equipment) => (
                    <div
                      key={equipment}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={equipment}
                        checked={formData.equipmentNeeded.includes(equipment)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(
                            "equipmentNeeded",
                            equipment,
                            Boolean(checked)
                          )
                        }
                      />
                      <Label htmlFor={equipment} className="cursor-pointer">
                        {equipment}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-gray-700 font-medium mb-3 block">
                  Specialist Equipment
                </Label>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    "Implant Kit",
                    "Ortho Setup",
                    "CBCT Scanner",
                    "Laser Equipment",
                    "Digital Impressions",
                    "Practice Management Software",
                    "Marketing Package",
                    "Training Program",
                  ].map((specialist) => (
                    <div
                      key={specialist}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={specialist}
                        checked={formData.specialistEquipment.includes(
                          specialist
                        )}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(
                            "specialistEquipment",
                            specialist,
                            Boolean(checked)
                          )
                        }
                      />
                      <Label htmlFor={specialist} className="cursor-pointer">
                        {specialist}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="text-center">
            <Button
              type="submit"
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white px-12 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Calculate My Practice Cost
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Calc;
