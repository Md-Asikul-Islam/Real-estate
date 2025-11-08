// src/components/TeamSection.jsx
import React from "react";

const teamMembers = [
  { name: "John Doe", role: "CEO", photo: "/assets/team/john.jpg" },
  { name: "Jane Smith", role: "COO", photo: "/assets/team/jane.jpg" },
  { name: "Mike Johnson", role: "Head of Sales", photo: "/assets/team/mike.jpg" },
  { name: "Sara Wilson", role: "Marketing Lead", photo: "/assets/team/sara.jpg" },
];

const TeamSection = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent text-3xl sm:text-4xl font-bold text-center mb-12">
          Meet Our Team
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="bg-white shadow-lg rounded-xl p-6 text-center hover:scale-105 transition-transform duration-300"
            >
              <img
                src={member.photo}
                alt={member.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <p className="text-gray-500">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(TeamSection);
