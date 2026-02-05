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
import { useSEO } from "@/app/hooks/useSEO";
import heroImage from "figma:asset/e04b5ddcf6b09092fedb3464492259e9e686797c.png";
import cricketDentonImage from "figma:asset/0c3216a43fa67afce06141b76c66a1b76af289e1.png";
import glennMcDowellImage from "figma:asset/1b7b415f562441031e1e8dcd5d5a83039116b7c1.png";
import daveBrindleyImage from "figma:asset/7014f2814f9b68183784c6c5453d179ffb444c02.png";

export function About() {
  useSEO({
    title: 'About Us',
    description: 'Learn about Sanctuary Development Collaborative\'s mission to help churches steward their properties for congregational vitality and community flourishing.'
  });
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
      name: "Dave Brindley",
      title: "Ministry & Community Development",
      image: daveBrindleyImage,
      bio: "Dave Brindley has worked for Cru (Campus Crusade) for over 20 years, the last 16 in West Philly. The past 3 years, he has worked under Cru's City ministry embedded at Resurrection Philadelphia, focusing on efforts to leverage their properties for greater missional engagement. Outside of ministry, he is the zoning chair for Walnut Hill Community Association and is an organizer for the 5th Sq, a pro-housing organization. He is excited for Sanctuary Development Collaborative to provide resources to neighborhood churches and housing to the vulnerable. Dave can often be found biking around the city he loves.",
    },
    {
      name: "Matt Peace",
      title: "Church Engagement & Global Partnership",
      image:
        "https://images.unsplash.com/photo-1762522927402-f390672558d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYWxlJTIwYnVzaW5lc3MlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzAyMzQ5NjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      bio: "Matt Peace serves with World Relief through Churches of Welcome, where he equips and resources churches to faithfully welcome the stranger. With a background in international leadership as former Director of Envision, he has traveled to 78 countries working in cross-cultural project management and global partnership development. Most recently, Matt led a refugee resettlement agency, deepening his understanding of the urgent need for affordable housing and holistic community support. When he's not working, you'll likely find him planning his next trip or cheering on his favorite teams—the Philadelphia Phillies and Chelsea FC.",
    },
    {
      name: "Glenn McDowell",
      title: "Housing & Mission Integration",
      image: glennMcDowellImage,
      bio: "Glenn McDowell grew up in Paraguay, South America and immigrated to the United States in high school. He has a heart for the poor, the marginalized, the voiceless and powerless. He and his wife Connie have adopted four children, three with special needs. He is on the board of Compound Impact which provides housing for refugees and is City Pastor at Liberti Riverwards Church.",
    },
    {
      name: "Rev. Cricket Denton",
      title: "Student & Mission Ministries",
      image: cricketDentonImage,
      bio: "Rev. Cricket Denton is an ordained deacon in the United Methodist Church and serves as Pastor for Student and Mission Ministries at Haddonfield UMC. She earned her Master of Divinity from Drew Theological School and is committed to refugee resettlement, affordable housing, and creating safe spaces of welcome and support. She lives in New Jersey with her husband and two daughters, where she continues to invest in community partnerships that help individuals and families find stability, belonging, and hope.",
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
            About Us
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
                      className="w-24 h-24 rounded-full bg-cover bg-center mx-auto mb-1"
                      style={{
                        backgroundImage: `url(${member.image})`,
                      }}
                    />
                    <h3 className="mb-0.5">{member.name}</h3>
                    <p className="text-xs text-muted-foreground">
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