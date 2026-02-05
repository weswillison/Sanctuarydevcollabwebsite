import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import {
  Heart,
  Leaf,
  Mail,
  Phone,
  ArrowRight,
  Handshake,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import heroImage from "figma:asset/e04b5ddcf6b09092fedb3464492259e9e686797c.png";

export function About() {
  const values = [
    {
      icon: Heart,
      title: "Mission-Focused",
      description:
        "We believe decisions about land and facilities are first and foremost ministry decisions. We help you steward your property in ways that faithfully support your mission, reflect your values, and strengthen your witness in the community.",
    },
    {
      icon: Leaf,
      title: "Sustainability",
      description:
        "We seek solutions that are viable for the long term—financially, environmentally, and operationally. Our goal is to help ministries remain healthy and effective for generations, not just solve short-term challenges.",
    },
    {
      icon: Handshake,
      title: "Partnership",
      description: `This work is best done together. We collaborate with church leaders, denominational bodies, community stakeholders, and financial and training partners to ensure decisions are well-informed, shared, and rooted in trust.`,
    },
  ];

  const teamMembers = [
    {
      name: "Sarah Mitchell",
      title: "Founder & Lead Consultant",
      image:
        "https://images.unsplash.com/photo-1649589244330-09ca58e4fa64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2ODMxMjE0Nnww&ixlib=rb-4.1.0&q=80&w=1080",
      bio: "Sarah brings 15 years of experience in real estate development and church leadership. Her unique background combines an M.Div. from Princeton Theological Seminary with an MBA in Real Estate Development. She has guided over 50 congregations through property transitions and development projects.",
    },
    {
      name: "Michael Chen",
      title: "Real Estate Development Advisor",
      image:
        "https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjgyMTUwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      bio: "Michael is a licensed architect and urban planner with 20 years of experience in community-focused development. He specializes in adaptive reuse projects and has worked with religious institutions across the Philadelphia region to reimagine their spaces for maximum community impact.",
    },
    {
      name: "Rev. Patricia Johnson",
      title: "Ministry & Community Engagement",
      image:
        "https://images.unsplash.com/photo-1655249493799-9cee4fe983bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHBlcnNvbnxlbnwxfHx8fDE3NjgyNDM2Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      bio: "Rev. Johnson serves as our pastoral consultant, bringing deep understanding of church governance, congregational dynamics, and change management. With 25 years in ministry and experience helping churches through transitions, she ensures that property decisions honor both mission and community.",
    },
    {
      name: "David Martinez",
      title: "Legal Counsel & Zoning Specialist",
      image:
        "https://images.unsplash.com/photo-1736939681295-bb2e6759dddc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBsYXd5ZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3Njk0OTMyNDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      bio: "David is a real estate attorney specializing in religious institutional properties and land use law. With expertise in navigating complex zoning regulations and negotiating development agreements, he helps churches protect their interests while maximizing the potential of their properties.",
    },
    {
      name: "Jennifer Wu",
      title: "Financial Planning & Capital Strategy",
      image:
        "https://images.unsplash.com/photo-1650784854430-3ab0c30afdf3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBmaW5hbmNlJTIwYWR2aXNvciUyMHBvcnRyYWl0fGVufDF8fHx8MTc2OTUzODY5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      bio: "Jennifer is a CPA and financial advisor who specializes in nonprofit capital projects and tax-exempt financing. She helps congregations develop sustainable financial models, access capital, and structure development deals that align with their mission while maintaining fiscal responsibility.",
    },
    {
      name: "Marcus Thompson",
      title: "Community Impact Coordinator",
      image:
        "https://images.unsplash.com/photo-1602566356438-dd36d35e989c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBjb21tdW5pdHklMjBvcmdhbml6ZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3Njk1Mzg2OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      bio: "Marcus brings a decade of experience in community organizing and neighborhood development. He facilitates stakeholder engagement processes, ensuring development projects reflect community needs and build authentic partnerships between churches and the neighborhoods they serve.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <div
        className="relative h-[400px] md:h-[500px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 to-foreground/50" />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl mb-4 text-white">
            About Sanctuary Development Collaborative
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Mission Statement */}
          <Card className="p-8 mb-12 bg-gradient-to-br from-accent/5 to-primary/5">
            <h2 className="text-2xl mb-4 text-center">
              Our Mission
            </h2>
            <p className="text-lg text-center text-muted-foreground">
              To equip churches and denominations to develop
              their underutilized buildings and land as engines
              for congregational vitality and community
              flourishing.
            </p>
          </Card>

          {/* Story */}
          <div className="mb-12">
            <h2 className="text-3xl mb-6">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Our buildings are getting older and emptier.
                These properties, given to us as gifts from past
                generations, have become present burdens.
                100,000 church property transitions are
                projected by 2030. This emergency cannot be
                ignored any longer. This is a dramatic change
                that our current church leaders are not equipped
                to handle on their own with their current tools.
                We want to train and support church leaders to
                navigate these transitions deftly by integrating
                theological and pastoral education with real
                estate development expertise.
              </p>
              <h3>What sets us apart:</h3>
              <p> - A commitment to engaging in this work as a
                form of ministry within the life of faith in
                your church faith context
                <br />- Hand-holding through the development process
                <br />- On-the-ground expertise partnering with contractors and engineers, evaluating developers, and navigating zoning questions
              </p>
            </div>
          </div>

          {/* Values */}
          <div>
            <h2 className="text-3xl mb-8 text-center">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>

          {/* Team Members */}
          <div className="mt-16">
            <div className="py-8">
              <h2 className="text-3xl mb-8 text-center">
                Meet Our Team
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {teamMembers.map((member, index) => (
                  <Card key={index} className="p-6 text-center">
                    <div
                      className="w-24 h-24 rounded-full bg-cover bg-center mx-auto mb-4"
                      style={{
                        backgroundImage: `url(${member.image})`,
                      }}
                    />
                    <h3 className="mb-2">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {member.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {member.bio}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Us Section */}
          <div className="mt-16">
            <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/10 to-accent/10">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl mb-4">
                  Ready to Start the Conversation?
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Let's discuss how we can help your church
                  navigate these ministry and real estate opportunities with
                  confidence and clarity.
                </p>

                <Link to="/contact">
                  <Button
                    size="lg"
                    className="bg-accent hover:bg-accent/90 text-xl px-12 py-8"
                  >
                    Get in Touch{" "}
                    <ArrowRight className="w-6 h-6 ml-2" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}