import { userQueryOptions } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import banner from "@public/banner.png";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { GlareCard } from "@/components/ui/glare-card";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { isPending, data, error } = useQuery(userQueryOptions);

  if (error) {
    toast.error("Failed to fetch user data");
  }

  return (
    <>
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center p-12">
        <h1 className="text-5xl font-extrabold mb-4">Welcome to Devhunt</h1>
        <p className="text-xl text-gray-200 mb-8">
          All your hackathons in one place!
        </p>
        <a
          href="/hackathons"
          className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition"
        >
          Get Started
        </a>
      </div>

      <MaxWidthWrapper>
        <div>
          {/* Hero Section */}
          <div className="relative flex pt-8 justify-center items-center overflow-hidden w-full">
            <img
              src={banner}
              alt="Banner Description"
              className="w-full h-auto object-cover object-center rounded-3xl shadow-lg"
            />
          </div>

          {/* Features Section */}
          <div className="py-12 px-6 md:px-12 lg:px-24">
            <h2 className="text-4xl font-bold text-center mb-12">
              Why Choose Us?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <GlareCard className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
                <h3 className="text-2xl font-semibold mb-4">
                  Hackathon Management
                </h3>
                <p className="text-gray-600">
                  Easily create, manage, and promote hackathons with our
                  intuitive event management tools. Track registrations, manage
                  schedules, and communicate with participants all in one place.
                </p>
              </GlareCard>
              <GlareCard className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
                <h3 className="text-2xl font-semibold mb-4">
                  Real-time Project Submissions
                </h3>
                <p className="text-gray-600">
                  Streamline the submission process with real-time project
                  uploads. Judges can access and evaluate submissions
                  efficiently, with features for scoring, feedback, and
                  announcements
                </p>
              </GlareCard>
              <GlareCard className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
                <h3 className="text-2xl font-semibold mb-4">Team Formation</h3>
                <p className="text-gray-600">
                  Facilitate team creation and collaboration among participants.
                  Our platform helps connect individuals with complementary
                  skills, ensuring balanced and effective teams.
                </p>
              </GlareCard>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>

      <footer className="bg-gray-800 text-white flex flex-col text-center p-6">
        © {new Date().getFullYear()} Devhunt. All rights reserved.
        <a className="font-bold text-blue-500 hover:underline" href="https://github.com/anur4ag/devhunt" target="blank">Open source @ Github</a>
      </footer>
    </>
  );
}
