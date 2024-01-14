import React from "react";
import headerImage from "../images/home.jpeg";
import { TbUsersGroup } from "react-icons/tb";
import { TbMessageChatbot } from "react-icons/tb";
import { TfiWrite } from "react-icons/tfi";
import { Link } from "react-router-dom";
import ChatBot from "../components/ChatBot";
import { useState } from "react";
import { SiChatbot } from "react-icons/si";
import Footer from "../components/Footer";
import { MdEditCalendar } from "react-icons/md";
export default function Home() {
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);
  const toggleChatBot = () => {
    setIsChatBotOpen(!isChatBotOpen);
  };

  return (
    <>
      {" "}
      <div className="max-w-full mx-auto p-4 rounded-lg shadow-lg bg-white">
        <img
          src={headerImage}
          alt="Header"
          className="w-full"
          style={{ height: "500px" }}
        />

        <h2
          class="
                  font-bold
                  font-mono
                  text-center
                  text-l
                  sm:text-2xl
                  md:text-[25px]
                  text-B0578D
                  mb-4
                  "
        >
          Embark on a Journey to Wellness with ManahSeva <br /> Trust us with
          your mental health, because your well-being is our priority
        </h2>
        <button class="mx-auto block bg-red-300 hover:bg-red-400 text-dark font-bold py-2 px-4  hover:border-red-400 rounded">
          <Link to="/SignIn" className="flex justify-center items-center">
            Get Started
          </Link>
        </button>
      </div>
      {/* <!-- ====== Features Section Start --> */}
      <section class="pt-10 lg:pt-[80px] pb-10 lg:pb-[10px]">
        <div class="container">
          <div class="flex flex-wrap -mx-4">
            <div class="w-full px-4">
              <div class="text-center mx-auto mb-12 lg:mb-20 max-w-[750px]">
                <h2 class="font-bold text-3xl sm:text-4xl md:text-[40px] text-dark mb-4">
                  Empower Your Mental Well-being with Our Features
                </h2>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap -mx-4">
            {/* //feature 1 */}
            <div className="w-full md:w-1/2 px-4 mb-8">
              <div
                className="
          p-10
          md:px-7
          xl:px-10
          rounded-[20px]
          bg-white
          shadow-md
          hover:shadow-lg
          mb-8
          flex
          flex-col
          items-center
          feature-card transform transition-transform hover:scale-105
        "
              >
                <div
                  className="
            w-[70px]
            h-[70px]
            flex
          flex-col
          items-center
            
            justify-center
            bg-4F709C
            rounded-2xl
            mb-8
          "
                >
                  <TbMessageChatbot size={32} color="white" />
                </div>
                <h4 className="font-semibold text-xl text-dark mb-3">
                  MindMate Chat Companion
                </h4>
                <p className="text-body-color text-center">
                  Experience a revolutionary chatbot dedicated to your mental
                  well-being. Our Chat Companion is not just an AI; it's your
                  empathetic listener, your guide through tough times, and your
                  partner in mental health care. Whether you need someone to
                  talk to or guidance on managing stress, MindMate is here for
                  you, 24/7.
                </p>
              </div>
            </div>
            {/* //feature 2 */}

            <div className="w-full md:w-1/2 px-4 mb-8">
              <div
                className="
          p-10
          md:px-7
          xl:px-10
          rounded-[20px]
          bg-white
          shadow-md
          hover:shadow-lg
          mb-8
          flex
          flex-col
          items-center
          feature-card transform transition-transform hover:scale-105
        "
              >
                <div
                  className="
            w-[70px]
            h-[70px]
            flex
          flex-col
          items-center
            
            justify-center
            bg-4F709C
            rounded-2xl
            mb-8
          "
                >
                  <TfiWrite size={32} color="white" />
                </div>
                <h4 className="font-semibold text-xl text-dark mb-3">
                  Mindful Blogs Hub
                </h4>
                <p className="text-body-color text-center">
                  Dive into a treasure trove of insights, stories, and expert
                  advice on mental health. Our Mindful Blogs Hub is your go-to
                  resource for understanding, coping, and thriving. From
                  personal narratives to professional tips, we cover it all.
                  Explore a world of mental health awareness and embark on a
                  journey towards a healthier mind.
                </p>
              </div>
            </div>
            {/* //feature 4 */}
            <div className="w-full md:w-1/2 px-4 mb-8">
              <div
                className="
          p-10
          md:px-7
          xl:px-10
          rounded-[20px]
          bg-white
          shadow-md
          hover:shadow-lg
          mb-8
          flex
          flex-col
          items-center
          feature-card transform transition-transform hover:scale-105
        "
              >
                <div
                  className="
            w-[70px]
            h-[70px]
            flex
          flex-col
          items-center
            
            justify-center
            bg-4F709C
            rounded-2xl
            mb-8
          "
                >
                  <TbUsersGroup size={32} color="white" />
                </div>
                <h4 className="font-semibold text-xl text-dark mb-3">
                  Unity Haven - Mental Health Community
                </h4>
                <p className="text-body-color text-center">
                  Join the conversation in Unity Haven, our exclusive community
                  group dedicated to mental health. Connect with individuals on
                  similar journeys, share your experiences, and find a support
                  system that truly understands.It's a safe space where we
                  uplift each other, break stigmas, and foster a community that
                  cares.
                </p>
              </div>
            </div>

            <div className="w-full md:w-1/2 px-4 mb-8">
              <div
                className="
          p-10
          md:px-7
          xl:px-10
          rounded-[20px]
          bg-white
          shadow-md
          hover:shadow-lg
          mb-8
          flex
          flex-col
          items-center
          feature-card transform transition-transform hover:scale-105
        "
              >
                <div
                  className="
            w-[70px]
            h-[70px]
            flex
          flex-col
          items-center
            
            justify-center
            bg-4F709C
            rounded-2xl
            mb-8
          "
                >
                  <MdEditCalendar size={32} color="white" />
                </div>
                <h4 className="font-semibold text-xl text-dark mb-3">
                  Personal Diary - Reflect, Express, and Grow
                </h4>
                <p className="text-body-color text-center">
                  Capture your daily experiences, emotions, and thoughts in your
                  personal diary.Our tool analyzes your entries, providing
                  valuable insights into your emotional well-being.Receive
                  tailored wellness tips based on your sentiments and download
                  comprehensive reports to track your emotional journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- ====== Features Section End --> */}
      {/* <!-- ====== Testimonials Section start --> */}
      <div class="py-16 white">
        <div class="container m-auto px-6 text-gray-600 md:px-12 xl:px-6">
          <div class="text-center mx-auto mb-12 lg:mb-20 max-w-[650px]">
            <h2
              class="
                  font-bold
                  text-3xl
                  sm:text-4xl
                  md:text-[40px]
                  text-dark
                  mb-4
                  "
            >
              Testimonials of Transformation
            </h2>
          </div>
          <div class="grid gap-8 md:grid-rows-2 lg:grid-cols-2">
            <div class="row-span-2 p-6 border border-gray-100 rounded-xl bg-gray-50 text-center sm:p-8">
              <div class="h-full flex flex-col justify-center space-y-4">
                <img
                  class="w-20 h-20 mx-auto rounded-full"
                  src="https://tailus.io/sources/blocks/grid-cards/preview/images/avatars/second_user.webp"
                  alt="user avatar"
                  height="220"
                  width="220"
                  loading="lazy"
                />
                <p class="text-gray-600 md:text-xl">
                  {" "}
                  <span class="font-serif">"</span>MindMate has been a
                  game-changer for me. The Chat Companion feels like a virtual
                  friend, always there when I need someone to talk to. The blogs
                  are a goldmine of knowledge, helping me navigate my mental
                  health journey. And the community group? It's not just a
                  group; it's a lifeline. Thank you, MindMate, for creating a
                  space that feels like home.
                  <span class="font-serif">"</span>
                </p>
                <div>
                  <h6 class="text-lg font-semibold leading-none">Emma W.</h6>
                </div>
              </div>
            </div>

            <div class="p-6 border border-gray-100 rounded-xl bg-gray-50 sm:flex sm:space-x-8 sm:p-8">
              <img
                class="w-20 h-20 mx-auto rounded-full"
                src="https://tailus.io/sources/blocks/grid-cards/preview/images/avatars/first_user.webp"
                alt="user avatar"
                height="220"
                width="220"
                loading="lazy"
              />
              <div class="space-y-4 mt-4 text-center sm:mt-0 sm:text-left">
                <p class="text-gray-600">
                  {" "}
                  <span class="font-serif">"</span> As someone who values
                  personal growth, MindMate's blogs have become my daily dose of
                  inspiration. The chatbot is surprisingly intuitive, providing
                  support tailored to my needs. But the real gem is the
                  community group—a place to share, learn, and feel understood.
                  MindMate, you've built more than a platform; you've built a
                  community that heals. <span class="font-serif">"</span>
                </p>
                <div>
                  <h6 class="text-lg font-semibold leading-none">Alex K.</h6>
                </div>
              </div>
            </div>
            <div class="p-6 border border-gray-100 rounded-xl bg-gray-50 sm:flex sm:space-x-8 sm:p-8">
              <img
                class="w-20 h-20 mx-auto rounded-full"
                src="https://tailus.io/sources/blocks/grid-cards/preview/images/avatars/third_user.webp"
                alt="user avatar"
                height="220"
                width="220"
                loading="lazy"
              />
              <div class="space-y-4 mt-4 text-center sm:mt-0 sm:text-left">
                <p class="text-gray-600">
                  {" "}
                  <span class="font-serif">"</span> Mental health is a journey,
                  and MindMate is the compass I never knew I needed. The
                  chatbot's empathy is unmatched, guiding me through tough
                  moments. The blogs are not just informative; they're relatable
                  stories that make me feel seen. And the community group? It's
                  where I found my tribe. Grateful for this platform that's
                  truly changing lives.. <span class="font-serif">"</span>
                </p>
                <div>
                  <h6 class="text-lg font-semibold leading-none">Adam S.</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- ====== Testimonials Section end --> */}
      {isChatBotOpen || (
        <button
          className="fixed bottom-5 right-5 bg-blue-500 hover:bg-blue-600 text-black p-3 rounded-full shadow-lg"
          onClick={toggleChatBot}
        >
          <SiChatbot className="text-3xl text-white" />
        </button>
      )}
      {isChatBotOpen && <ChatBot isOpen={true} toggleChatBot={toggleChatBot} />}
      <Footer />
    </>
  );
}
